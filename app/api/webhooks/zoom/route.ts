/**
 * Zoom Webhook Receiver API
 * POST /api/webhooks/zoom
 * 
 * Receives and processes Zoom webhook events:
 * - participant_joined
 * - participant_left
 * - meeting_ended (triggers post-meeting processing)
 */

import { NextRequest, NextResponse } from 'next/server';
import { zoomService } from '@/lib/zoom/zoomService';
import { ZoomWebhookPayload } from '@/lib/zoom/types';
import { rawZoomLogs, workshopParticipants } from '@/lib/mongodb/mockData';

export async function POST(request: NextRequest) {
  try {
    // 🔐 Step 1: Verify Webhook Signature
    const signature = request.headers.get('x-zm-signature') || '';
    const timestamp = request.headers.get('x-zm-request-timestamp') || '';
    const rawBody = await request.text();

    const isValid = zoomService.verifyWebhookSignature(rawBody, timestamp, signature);
    
    if (!isValid) {
      console.error('❌ Invalid Zoom webhook signature');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 📥 Step 2: Parse Payload
    const payload: ZoomWebhookPayload = JSON.parse(rawBody);
    const { event } = payload;

    // 💾 Step 3: Log Raw Event (for audit trail)
    rawZoomLogs.push({
      _id: `log_${Date.now()}`,
      payload,
      eventType: event,
      receivedAt: new Date(),
    });

    console.log(`📬 Zoom Webhook: ${event}`);

    // 🎯 Step 4: Route Event to Handler
    switch (event) {
      case 'meeting.participant_joined':
        await handleParticipantJoined(payload);
        break;

      case 'meeting.participant_left':
        await handleParticipantLeft(payload);
        break;

      case 'meeting.ended':
        await handleMeetingEnded(payload);
        break;

      default:
        console.log(`ℹ️ Unhandled event type: ${event}`);
    }

    return NextResponse.json({ success: true, event });
  } catch (error) {
    console.error('❌ Zoom webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * 🟢 Handle: Participant Joined
 * Creates or updates participant tracking record
 */
async function handleParticipantJoined(payload: ZoomWebhookPayload) {
  const { object }: any = payload.payload;
  const meetingId = object.id;
  const participant = object.participant;

  // Parse user ID from display name
  const { ellipsisUserId } = zoomService.parseZoomUserName(participant.user_name);

  if (!ellipsisUserId) {
    console.warn(`⚠️ User joined without UID tag: ${participant.user_name}`);
    return;
  }

  // Find or create participant record
  let record = workshopParticipants.find(
    (p) => p.userId === ellipsisUserId && p.workshopId === meetingId
  );

  if (!record) {
    record = {
      _id: `participant_${Date.now()}`,
      userId: ellipsisUserId,
      workshopId: meetingId,
      role: 'participant',
      joinTime: new Date(participant.join_time),
      totalDurationMinutes: 0,
      attendancePercentage: 0,
      status: 'attended',
      certificateUnlocked: false,
      joyCoinsAwarded: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    workshopParticipants.push(record);
  } else {
    record.joinTime = new Date(participant.join_time);
    record.updatedAt = new Date();
  }

  console.log(`✅ Participant joined: User ${ellipsisUserId} in Meeting ${meetingId}`);
}

/**
 * 🔴 Handle: Participant Left
 * Updates leave time (used for duration calculation later)
 */
async function handleParticipantLeft(payload: ZoomWebhookPayload) {
  const { object }: any = payload.payload;
  const meetingId = object.id;
  const participant = object.participant;

  const { ellipsisUserId } = zoomService.parseZoomUserName(participant.user_name);

  if (!ellipsisUserId) return;

  const record = workshopParticipants.find(
    (p) => p.userId === ellipsisUserId && p.workshopId === meetingId
  );

  if (record) {
    record.leaveTime = new Date(participant.leave_time || new Date());
    record.updatedAt = new Date();
  }

  console.log(`🚪 Participant left: User ${ellipsisUserId} from Meeting ${meetingId}`);
}

/**
 * 🏁 Handle: Meeting Ended
 * Triggers post-meeting processing (attendance calculation, rewards)
 */
async function handleMeetingEnded(payload: ZoomWebhookPayload) {
  const { object }: any = payload.payload;
  const meetingId = object.id;

  console.log(`🎬 Meeting ended: ${meetingId}. Scheduling post-meeting processing...`);

  // ⏰ Schedule processing after 15 minutes (Zoom needs time to generate reports)
  setTimeout(async () => {
    try {
      await processPostMeetingRewards(meetingId);
    } catch (error) {
      console.error(`❌ Post-meeting processing failed for ${meetingId}:`, error);
    }
  }, 15 * 60 * 1000); // 15 minutes

  return;
}

/**
 * 💰 Post-Meeting Processing
 * Fetches Zoom report, calculates attendance, awards JoyCoins & unlocks certificates
 */
async function processPostMeetingRewards(meetingId: string) {
  console.log(`⚙️ Processing rewards for meeting ${meetingId}...`);

  // Get participants from Zoom report (SOURCE OF TRUTH)
  const participants = await zoomService.getParticipantsReport(meetingId);
  
  // Get workshop details (duration)
  const workshop = { duration: 60 }; // TODO: Fetch from DB

  for (const participant of participants) {
    const { ellipsisUserId } = zoomService.parseZoomUserName(participant.name);
    
    if (!ellipsisUserId) continue;

    // Calculate attendance
    const attendedMinutes = Math.floor(participant.duration / 60);
    const attendancePercentage = zoomService.calculateAttendancePercentage(
      attendedMinutes,
      workshop.duration
    );

    // Find or create participant record
    let record = workshopParticipants.find(
      (p) => p.userId === ellipsisUserId && p.workshopId === meetingId
    );

    if (!record) {
      record = {
        _id: `participant_${Date.now()}`,
        userId: ellipsisUserId,
        workshopId: meetingId,
        role: 'participant',
        totalDurationMinutes: attendedMinutes,
        attendancePercentage,
        status: 'completed',
        certificateUnlocked: false,
        joyCoinsAwarded: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      workshopParticipants.push(record);
    }

    record.totalDurationMinutes = attendedMinutes;
    record.attendancePercentage = attendancePercentage;

    // 🎓 Unlock Certificate (75%+ attendance)
    if (zoomService.qualifiesForCertificate(attendancePercentage) && !record.certificateUnlocked) {
      record.certificateUnlocked = true;
      record.status = 'completed';
      console.log(`🎓 Certificate unlocked for User ${ellipsisUserId}`);
    }

    // 💰 Award JoyCoins (first time only)
    if (record.certificateUnlocked && !record.joyCoinsAwarded) {
      const rewardAmount = 20; // Default reward
      await awardJoyCoins(ellipsisUserId, rewardAmount, meetingId);
      record.joyCoinsAwarded = true;
      console.log(`💰 Awarded ${rewardAmount} JoyCoins to User ${ellipsisUserId}`);
    }

    record.updatedAt = new Date();
  }

  console.log(`✅ Post-meeting processing complete for ${meetingId}`);
}

/**
 * 💳 Award JoyCoins to User
 */
async function awardJoyCoins(userId: string, amount: number, workshopId: string) {
  // TODO: Implement actual JoyCoin transaction
  console.log(`💰 Crediting ${amount} JoyCoins to User ${userId} for Workshop ${workshopId}`);
  
  // This will be implemented in the JoyCoin service
  return true;
}
