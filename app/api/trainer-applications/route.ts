import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    console.log('Trainer application received:', data);

    // Send confirmation email
    const emailRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/email/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: data.email,
        subject: 'Welcome to the Happiness Squad! 🌟',
        template: 'trainer-application',
        data: {
          fullName: data.fullName,
          expertise: data.expertise?.join(', '),
          experience: data.experience,
          organization: data.organization,
        },
      }),
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Application submitted successfully',
        id: Math.random().toString(36).substr(2, 9),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error processing trainer application:', error);
    return NextResponse.json(
      { error: 'Failed to process application' },
      { status: 500 }
    );
  }
}
