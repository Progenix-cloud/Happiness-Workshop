/**
 * Attended Workshops API
 * GET /api/workshops/attended
 * Returns all workshops the user has attended
 */

import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/auth/authService';
import { users, workshops, workshopParticipants } from '@/lib/mongodb/mockData';

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await authService.getCurrentUser(token);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all workshops where user has attended/completed
    const attendedWorkshops = workshopParticipants
      .filter(
        (p) =>
          p.userId === user._id && 
          (p.status === 'attended' || p.status === 'completed')
      )
      .map((participant) => {
        const workshop = workshops.find((w) => w._id === participant.workshopId);
        
        return {
          workshopId: participant.workshopId,
          workshopTitle: workshop?.title || 'Unknown Workshop',
          date: workshop?.date || new Date(),
          totalDurationMinutes: participant.totalDurationMinutes,
          attendancePercentage: participant.attendancePercentage,
          status: participant.status,
          certificateUnlocked: participant.certificateUnlocked,
          joyCoinsAwarded: participant.joyCoinsAwarded,
        };
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({
      workshops: attendedWorkshops,
      total: attendedWorkshops.length,
    });
  } catch (error) {
    console.error('Error fetching attended workshops:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
