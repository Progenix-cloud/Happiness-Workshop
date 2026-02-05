/**
 * Workshop Join Endpoint
 * GET /api/workshops/[id]/join
 * 
 * Tags the user with their ID and redirects to Zoom with tracking
 */

import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/auth/authService';
import { users, workshops, workshopParticipants } from '@/lib/mongodb/mockData';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: workshopId } = await params;

    // 🔐 Step 1: Get authenticated user (from token/session)
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await authService.getCurrentUser(token);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 📚 Step 2: Get workshop details
    const workshop = workshops.find((w) => w._id === workshopId);
    
    if (!workshop) {
      return NextResponse.json({ error: 'Workshop not found' }, { status: 404 });
    }

    if (!workshop.zoomMeetingId) {
      return NextResponse.json(
        { error: 'This workshop does not have a Zoom link' },
        { status: 400 }
      );
    }

    // 🎯 Step 3: Create tracking tag
    // Format: "John Doe__UID_user123"
    const zoomDisplayName = `${user.name}__UID_${user._id}`;

    // 🔗 Step 4: Build Zoom Join URL
    const joinUrl = new URL(`https://zoom.us/j/${workshop.zoomMeetingId}`);
    
    if (workshop.zoomPassword) {
      joinUrl.searchParams.set('pwd', workshop.zoomPassword);
    }
    
    // Set the display name for tracking
    joinUrl.searchParams.set('uname', zoomDisplayName);

    // 💾 Step 5: Log join attempt (optional, for debugging)
    console.log(
      `🚀 User ${user.email} joining workshop ${workshop.title} (${workshopId})`
    );

    // Create participant record if doesn't exist
    const existingParticipant = workshopParticipants.find(
      (p) => p.userId === user._id && p.workshopId === workshopId
    );

    if (!existingParticipant) {
      workshopParticipants.push({
        _id: `participant_${Date.now()}`,
        userId: user._id!,
        workshopId,
        role: user.role === 'trainer' ? 'trainer' : user.role === 'volunteer' ? 'volunteer' : 'participant',
        totalDurationMinutes: 0,
        attendancePercentage: 0,
        status: 'registered',
        certificateUnlocked: false,
        joyCoinsAwarded: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // 🎬 Step 6: Redirect to Zoom
    return NextResponse.redirect(joinUrl.toString());
  } catch (error) {
    console.error('❌ Join workshop error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
