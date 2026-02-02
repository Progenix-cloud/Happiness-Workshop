import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // In mock mode, just return success
    console.log('Workshop request received:', data);

    // Send email notification
    const emailRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/email/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: data.email,
        subject: 'Your Custom Happiness Workshop Request Details',
        template: 'workshop-request',
        data: {
          contactPerson: data.contactPerson,
          organizationName: data.organizationName,
          preferredDate: data.preferredDate,
          preferredFormat: data.preferredFormat,
          numberOfParticipants: data.numberOfParticipants,
          focusAreas: data.focusAreas?.join(', '),
        },
      }),
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Workshop request submitted successfully',
        id: Math.random().toString(36).substr(2, 9),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error processing workshop request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
