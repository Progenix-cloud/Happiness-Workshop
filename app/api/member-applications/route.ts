import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email/emailService';
import { memoryDb } from '@/lib/mongodb/mockData';

// POST: Submit new application
// GET: Get all applications (admin only)
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const baseUrl = request.nextUrl.origin;

    console.log('[MEMBER-APP] Application received:', {
      type: data.applicationType,
      userId: data.userId,
      email: data.email,
      fullName: data.fullName,
    });

    // Create application with timeline
    const application = {
      ...data,
      status: 'submitted',
      timeline: {
        submitted: {
          date: new Date(),
          completed: true,
        },
        underReview: {
          completed: false,
        },
        approved: {
          completed: false,
        },
        interviewScheduled: {
          completed: false,
        },
      },
      isEditable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      _id: Math.random().toString(36).substr(2, 9), // Mock ID
    };

    // Add progress tracking to the application
    application.progress = {
      submitted: true,
      underReview: false,
      approved: false,
      completed: false,
    };

    // Store in memoryDb
    memoryDb.memberApplications.push(application);
    console.log('[MEMBER-APP] Application stored. Total applications:', memoryDb.memberApplications.length);

    console.log('[MEMBER-APP] Current applications in memoryDb:', memoryDb.memberApplications);

    // Send confirmation email
    try {
      const emailResult = await sendEmail({
        to: data.email,
        templateType: 'member-application-submitted',
        data: {
          fullName: data.fullName,
          applicationType: data.applicationType,
        },
      });
      console.log('[MEMBER-APP] Confirmation email sent:', { to: data.email, result: emailResult });
    } catch (emailError) {
      console.error('[MEMBER-APP] Error sending confirmation email:', emailError);
    }

    // Create notification
    const notificationRes = await fetch(`${baseUrl}/api/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: data.userId,
        type: 'application_submitted',
        title: 'Application Submitted',
        message: `Your ${data.applicationType} application has been received and is under review.`,
        relatedId: application._id,
        actionUrl: '/dashboard/member-application',
      }),
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Application submitted successfully',
        application,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[MEMBER-APP] Error processing member application:', error);
    return NextResponse.json(
      { error: 'Failed to process application' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('[MEMBER-APP] Fetching all applications. Count:', memoryDb.memberApplications.length);

    return NextResponse.json({
      success: true,
      applications: memoryDb.memberApplications,
    });
  } catch (error) {
    console.error('[MEMBER-APP] Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}
