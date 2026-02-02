import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { userId, workshopId, status } = await request.json();

    console.log('Workshop registration:', { userId, workshopId, status });

    // Send confirmation email
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/email/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: 'user@example.com',
        subject: 'Confirmation of Your Workshop Registration',
        template: 'workshop-registration',
        data: {
          workshopName: 'Workshop Name',
          date: new Date().toLocaleDateString(),
          venue: 'Workshop Venue',
        },
      }),
    }).catch(err => console.log('Email send error:', err));

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully registered for the workshop',
        bookingId: Math.random().toString(36).substr(2, 9),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error registering for workshop:', error);
    return NextResponse.json(
      { error: 'Failed to register for workshop' },
      { status: 500 }
    );
  }
}
