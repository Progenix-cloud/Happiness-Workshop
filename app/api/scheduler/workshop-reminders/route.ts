/**
 * Workshop Reminder Email Scheduler
 * 
 * This service sends zoom links to registered participants 30 minutes before the workshop starts.
 * 
 * IMPLEMENTATION OPTIONS:
 * 1. Cron Job (Recommended for Production): Use Vercel Cron, AWS EventBridge, or node-cron
 * 2. Next.js Route Handler (For Development): Call this endpoint periodically
 * 3. External Service: Use services like SendGrid's scheduled sends
 */

import { NextResponse } from 'next/server';

interface Workshop {
  _id: string;
  title: string;
  date: Date;
  time: string;
  zoomJoinUrl?: string;
  zoomMeetingId?: string;
  zoomPassword?: string;
  registrations: {
    userId: string;
    status: 'booked' | 'attended' | 'interested' | 'cancelled';
    registrationDetails?: {
      email?: string;
      fullName?: string;
    };
  }[];
}

/**
 * Check if workshop starts in approximately 30 minutes
 */
function isUpcomingIn30Minutes(workshopDate: Date, workshopTime: string): boolean {
  const now = new Date();
  
  // Parse workshop datetime
  const [hours, minutes] = workshopTime.split(':').map(Number);
  const workshopDateTime = new Date(workshopDate);
  workshopDateTime.setHours(hours, minutes, 0, 0);
  
  // Calculate time difference in minutes
  const timeDiffMs = workshopDateTime.getTime() - now.getTime();
  const timeDiffMinutes = Math.floor(timeDiffMs / (1000 * 60));
  
  // Check if between 25-35 minutes (5-minute window to account for cron timing)
  return timeDiffMinutes >= 25 && timeDiffMinutes <= 35;
}

/**
 * Send zoom link email to participant
 */
async function sendZoomLinkEmail(
  recipientEmail: string,
  recipientName: string,
  workshop: Workshop
) {
  try {
    const emailData = {
      to: recipientEmail,
      subject: `🔗 Zoom Link: ${workshop.title} starts in 30 minutes!`,
      template: 'workshop-zoom-reminder',
      data: {
        participantName: recipientName,
        workshopTitle: workshop.title,
        workshopDate: new Date(workshop.date).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        workshopTime: workshop.time,
        zoomJoinUrl: workshop.zoomJoinUrl,
        zoomMeetingId: workshop.zoomMeetingId,
        zoomPassword: workshop.zoomPassword,
      },
    };

    const res = await fetch('/api/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailData),
    });

    if (res.ok) {
      console.log(`✅ Zoom link sent to ${recipientEmail} for workshop ${workshop.title}`);
      return true;
    } else {
      console.error(`❌ Failed to send zoom link to ${recipientEmail}`);
      return false;
    }
  } catch (error) {
    console.error(`Error sending zoom link to ${recipientEmail}:`, error);
    return false;
  }
}

/**
 * Main scheduler function - checks all workshops and sends reminders
 */
export async function GET() {
  try {
    console.log('🕐 Running workshop reminder scheduler...');

    // Fetch all published workshops
    // TODO: Replace with actual database query
    const mockWorkshops: Workshop[] = [];
    
    // In production:
    // const workshops = await db.workshops.find({
    //   status: 'published',
    //   date: { $gte: new Date() }
    // });

    let remindersSent = 0;
    let errors = 0;

    for (const workshop of mockWorkshops) {
      // Check if workshop starts in 30 minutes
      if (isUpcomingIn30Minutes(new Date(workshop.date), workshop.time)) {
        console.log(`📧 Sending reminders for workshop: ${workshop.title}`);

        if (!workshop.zoomJoinUrl) {
          console.warn(`⚠️ Workshop ${workshop.title} has no zoom link!`);
          continue;
        }

        // Send emails to all booked participants
        const bookedParticipants = workshop.registrations.filter(
          (r) => r.status === 'booked'
        );

        for (const reg of bookedParticipants) {
          // TODO: Fetch user details from database
          // const user = await db.users.findById(reg.userId);
          const userEmail = reg.registrationDetails?.email || 'user@example.com';
          const userName = reg.registrationDetails?.fullName || 'Participant';

          const sent = await sendZoomLinkEmail(userEmail, userName, workshop);
          
          if (sent) {
            remindersSent++;
          } else {
            errors++;
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Scheduler completed: ${remindersSent} reminders sent, ${errors} errors`,
      remindersSent,
      errors,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in workshop reminder scheduler:', error);
    return NextResponse.json(
      { 
        error: 'Scheduler failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * PRODUCTION DEPLOYMENT GUIDE:
 * 
 * Option 1: Vercel Cron (Recommended for Vercel deployments)
 * --------------------------------------------------------
 * Create vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/scheduler/workshop-reminders",
 *     "schedule": "* * * * *"  // Every minute
 *   }]
 * }
 * 
 * Option 2: AWS EventBridge
 * -------------------------
 * Create AWS EventBridge rule to trigger this endpoint every minute
 * 
 * Option 3: Node-cron (For self-hosted)
 * --------------------------------------
 * In a separate background service:
 * 
 * import cron from 'node-cron';
 * 
 * cron.schedule('* * * * *', async () => {
 *   await fetch('https://your-domain.com/api/scheduler/workshop-reminders');
 * });
 * 
 * Option 4: GitHub Actions (For low-traffic apps)
 * ------------------------------------------------
 * Create .github/workflows/workshop-reminders.yml:
 * 
 * name: Workshop Reminders
 * on:
 *   schedule:
 *     - cron: '* * * * *'  # Every minute
 * 
 * jobs:
 *   send-reminders:
 *     runs-on: ubuntu-latest
 *     steps:
 *       - name: Trigger Reminder Endpoint
 *         run: |
 *           curl -X GET https://your-domain.com/api/scheduler/workshop-reminders
 */
