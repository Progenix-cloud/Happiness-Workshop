import { NextRequest, NextResponse } from 'next/server';

/**
 * Generate a secure random temporary password
 */
function generateTemporaryPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

// POST: Approve application and create new user account (admin only)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { adminId } = await request.json();
    const { id } = params;

    console.log('Approving application:', id, 'by admin:', adminId);

    // TODO: Replace with actual database logic
    // In a real app:
    // 1. Fetch the application from database
    // const application = await db.memberApplications.findById(id);
    
    // Mock application data for development
    const mockApplication = {
      _id: id,
      userId: 'user_123',
      applicationType: 'trainer', // or 'volunteer'
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      status: 'pending',
    };

    // Generate temporary password
    const temporaryPassword = generateTemporaryPassword();
    
    // TODO: Replace with actual database logic
    // 2. Create new user account with trainer/volunteer role
    // const hashedPassword = await bcrypt.hash(temporaryPassword, 10);
    // const newUser = await db.users.create({
    //   email: application.email,
    //   name: application.fullName,
    //   password: hashedPassword,
    //   role: application.applicationType, // 'trainer' or 'volunteer'
    //   phone: application.phone,
    //   age: application.age,
    //   avatar: null,
    //   bio: application.applicationType === 'trainer' ? application.trainingExperience : application.motivation,
    //   company: application.organization,
    //   location: `${application.city}, ${application.state}`,
    //   happinessScore: 80,
    //   certificatesCount: 0,
    //   workshopsAttended: 0,
    //   workshopsBooked: 0,
    //   joyCoins: 100, // Welcome bonus!
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    // });

    console.log('Created new user account:', mockApplication.email);
    console.log('Temporary password:', temporaryPassword);

    // TODO: Replace with actual database logic
    // 3. Update application status
    const updatedApplication = {
      _id: id,
      ...mockApplication,
      status: 'approved',
      isEditable: false,
      timeline: {
        submitted: { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), completed: true },
        underReview: { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), completed: true },
        approved: {
          date: new Date(),
          completed: true,
          approvedBy: adminId,
        },
        interviewScheduled: { completed: false },
      },
      newAccountCreated: true,
      temporaryPasswordSent: true,
      updatedAt: new Date(),
    };

    // Update progress tracking for application approval
    mockApplication.progress.underReview = true;
    mockApplication.progress.approved = true;
    mockApplication.progress.completed = true;

    // 4. Send account credentials email
    const credentialsEmailData = {
      to: mockApplication.email,
      templateType: 'account-credentials',
      data: {
        fullName: mockApplication.fullName,
        applicationType: mockApplication.applicationType,
        email: mockApplication.email,
        temporaryPassword: temporaryPassword,
        loginUrl: 'https://happiness-dashboard.com/login',
      },
    };

    try {
      const emailRes = await fetch(new URL('/api/email/send', request.url).toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentialsEmailData),
      });

      if (emailRes.ok) {
        console.log('✅ Account credentials email sent to:', mockApplication.email);
      } else {
        console.error('❌ Failed to send credentials email');
      }
    } catch (emailError) {
      console.error('Error sending credentials email:', emailError);
    }

    // 5. Send approval notification email
    const approvalEmailData = {
      to: mockApplication.email,
      templateType: 'member-application-approved',
      data: {
        fullName: mockApplication.fullName,
        applicationType: mockApplication.applicationType,
      },
    };

    try {
      await fetch(new URL('/api/email/send', request.url).toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(approvalEmailData),
      });
    } catch (emailError) {
      console.error('Error sending approval email:', emailError);
    }

    // 6. Create in-app notification
    try {
      await fetch(new URL('/api/notifications', request.url).toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: mockApplication.userId,
          type: 'application_approved',
          title: 'Application Approved! 🎉',
          message: `Your ${mockApplication.applicationType} application has been approved. Check your email for login credentials.`,
          relatedId: id,
        }),
      });
    } catch (notifError) {
      console.error('Error creating notification:', notifError);
    }

    // Create notification for application approval
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: mockApplication.userId,
          type: 'application_approved',
          title: 'Application Approved',
          message: `Your application for ${mockApplication.applicationType} has been approved!`,
          relatedId: mockApplication._id,
          actionUrl: '/dashboard/member-application',
        }),
      });
      console.log('[NOTIFICATION] Application approval notification created.');
    } catch (notifError) {
      console.error('[NOTIFICATION] Error creating application approval notification:', notifError);
    }

    return NextResponse.json({
      success: true,
      application: updatedApplication,
      message: 'Application approved and account created successfully',
      accountCreated: true,
    });
  } catch (error) {
    console.error('Error approving application:', error);
    return NextResponse.json(
      { error: 'Failed to approve application' },
      { status: 500 }
    );
  }
}
