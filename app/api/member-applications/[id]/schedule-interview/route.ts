import { NextRequest, NextResponse } from 'next/server';

// POST: Schedule interview (admin only)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { adminId, interviewDate, interviewTime, interviewLink } = await request.json();
    const { id } = params;

    console.log('Scheduling interview for application:', id);

    // In a real app, verify admin permissions
    // Update application status and timeline

    const updatedApplication = {
      _id: id,
      status: 'interview_scheduled',
      isEditable: false,
      timeline: {
        submitted: { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), completed: true },
        underReview: { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), completed: true },
        approved: { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), completed: true },
        interviewScheduled: {
          date: new Date(),
          completed: true,
          interviewDate: new Date(interviewDate),
          interviewTime,
          interviewLink,
          scheduledBy: adminId,
        },
      },
      updatedAt: new Date(),
    };

    // Send notification to user
    const notificationRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'user-id', // Get from application
        type: 'interview_scheduled',
        title: 'Interview Scheduled',
        message: `Your interview has been scheduled for ${new Date(interviewDate).toLocaleDateString()} at ${interviewTime}`,
        relatedId: id,
        actionUrl: '/dashboard/member-application',
      }),
    });

    // Send email
    const emailRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/email/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: 'user-email', // Get from application
        subject: 'Interview Scheduled - Happiness & Well-being Dashboard',
        template: 'interview-scheduled',
        data: {
          fullName: 'User Name',
          interviewDate: new Date(interviewDate).toLocaleDateString(),
          interviewTime,
          interviewLink,
        },
      }),
    });

    return NextResponse.json({
      success: true,
      application: updatedApplication,
    });
  } catch (error) {
    console.error('Error scheduling interview:', error);
    return NextResponse.json(
      { error: 'Failed to schedule interview' },
      { status: 500 }
    );
  }
}
