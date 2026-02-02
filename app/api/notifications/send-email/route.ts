import { NextRequest, NextResponse } from 'next/server';

interface EmailPayload {
  to: string;
  subject: string;
  type: 'workshop-confirmation' | 'certificate-earned' | 'reminder' | 'feedback';
  data: Record<string, string>;
}

export async function POST(request: NextRequest) {
  try {
    const payload: EmailPayload = await request.json();

    // Validate input
    if (!payload.to || !payload.subject || !payload.type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Template mapping
    const templates: Record<string, (data: Record<string, string>) => string> = {
      'workshop-confirmation': (data) => `
        <h1>Workshop Confirmation</h1>
        <p>Dear ${data.name},</p>
        <p>Your registration for <strong>${data.workshopTitle}</strong> has been confirmed!</p>
        <p><strong>Date:</strong> ${data.date}</p>
        <p><strong>Time:</strong> ${data.time}</p>
        <p><strong>Location:</strong> ${data.location}</p>
        <p>See you there! 🎉</p>
      `,
      'certificate-earned': (data) => `
        <h1>Congratulations! 🎖️</h1>
        <p>Dear ${data.name},</p>
        <p>You have earned a certificate for completing the <strong>${data.workshopTitle}</strong> workshop!</p>
        <p>Your certificate is ready for download in your dashboard.</p>
        <p>Keep spreading happiness! 💚</p>
      `,
      'reminder': (data) => `
        <h1>Workshop Reminder ⏰</h1>
        <p>Dear ${data.name},</p>
        <p>Just a reminder: <strong>${data.workshopTitle}</strong> starts in ${data.hoursUntil} hours!</p>
        <p><strong>Time:</strong> ${data.time}</p>
        <p><strong>Location:</strong> ${data.location}</p>
        <p>Don't miss it!</p>
      `,
      'feedback': (data) => `
        <h1>Thank You for Your Feedback!</h1>
        <p>Dear ${data.name},</p>
        <p>Thank you for taking the time to provide feedback on our workshop <strong>${data.workshopTitle}</strong>.</p>
        <p>Your input helps us improve and provide better experiences.</p>
        <p>We appreciate your participation! 🙏</p>
      `
    };

    // Generate email body
    const emailBody = templates[payload.type]?.(payload.data) || 'Email body';

    // Log email (in production, integrate with Resend, SendGrid, etc.)
    console.log('[v0] Email notification:', {
      to: payload.to,
      subject: payload.subject,
      type: payload.type,
      timestamp: new Date().toISOString()
    });

    // Simulate email sending (replace with actual email service in production)
    // For now, we'll just return success
    return NextResponse.json({
      success: true,
      message: 'Email notification queued successfully',
      messageId: `msg_${Date.now()}_${Math.random().toString(36).substring(7)}`
    });
  } catch (error) {
    console.error('[v0] Email notification error:', error);
    return NextResponse.json(
      { error: 'Failed to send email notification' },
      { status: 500 }
    );
  }
}
