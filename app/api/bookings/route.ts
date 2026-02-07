import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email/emailService';
import { memoryDb } from '@/lib/mongodb/mockData';

export async function POST(request: NextRequest) {
  try {
    const { userId, workshopId, status, registrationDetails } = await request.json();

    if (!userId || !workshopId) {
      return NextResponse.json(
        { error: 'User ID and Workshop ID required' },
        { status: 400 }
      );
    }

    console.log('[BOOKING] New booking request:', {
      userId,
      workshopId,
      status,
      registrationDetails,
    });

    // Get the workshop
    const workshop = memoryDb.workshops.find(w => w._id === workshopId);
    if (!workshop) {
      return NextResponse.json(
        { error: 'Workshop not found' },
        { status: 404 }
      );
    }

    // Get user details (from mock)
    const user = memoryDb.users?.find(u => u._id === userId);
    const userEmail = user?.email || registrationDetails?.email || 'participant@happiness.com';
    const userName = user?.name || registrationDetails?.fullName || 'User';

    // Check if already registered
    const existingRegistration = workshop.registrations?.find(
      r => r.userId === userId
    );

    if (existingRegistration) {
      // Update status instead of creating new
      existingRegistration.status = status;
      existingRegistration.registrationDetails = registrationDetails;
      existingRegistration.registeredAt = new Date().toISOString();
    } else {
      // Create new registration
      const registration = {
        _id: Math.random().toString(36).substr(2, 9),
        userId,
        status,
        registrationDetails,
        registeredAt: new Date().toISOString(),
      };

      if (!workshop.registrations) {
        workshop.registrations = [];
      }
      workshop.registrations.push(registration);

      // Update current enrollment
      workshop.currentEnrollment = (workshop.currentEnrollment || 0) + 1;
    }

    console.log('[BOOKING] Registration successful for user:', userId, 'workshop:', workshopId);

    // Send confirmation email
    try {
      const emailResult = await sendEmail({
        to: userEmail,
        templateType: 'registration',
        data: {
          userName,
          workshopTitle: workshop.title,
          workshopDate: new Date(workshop.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          workshopTime: workshop.time,
        },
      });

      console.log('[EMAIL] Registration confirmation sent to:', userEmail, 'Result:', emailResult);
    } catch (emailError) {
      console.error('[EMAIL] Error sending registration confirmation:', emailError);
      // Don't fail the booking if email fails
    }

    // Create notification for workshop registration
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          type: 'workshop-registration',
          message: `You have successfully registered for the workshop: ${workshop.title}`,
        }),
      });
      console.log('[NOTIFICATION] Workshop registration notification created.');
    } catch (notifError) {
      console.error('[NOTIFICATION] Error creating workshop registration notification:', notifError);
    }

    return NextResponse.json(
      {
        success: true,
        message: `Successfully ${status === 'booked' ? 'registered for' : 'marked as interested in'} the workshop!`,
        booking: {
          _id: existingRegistration?._id || Math.random().toString(36).substr(2, 9),
          workshopId,
          workshopTitle: workshop.title,
          status,
          registeredAt: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[BOOKING] Error creating booking:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create booking' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    // Get all bookings for this user across all workshops
    const bookings: any[] = [];

    memoryDb.workshops.forEach(workshop => {
      const registration = workshop.registrations?.find(r => r.userId === userId);
      if (registration) {
        bookings.push({
          _id: registration._id,
          workshopId: workshop._id,
          workshopTitle: workshop.title,
          date: workshop.date,
          time: workshop.time,
          location: workshop.location,
          trainer: workshop.trainerName || 'TBD',
          status: registration.status,
          registeredAt: registration.registeredAt,
        });
      }
    });

    console.log('[BOOKING] Retrieved', bookings.length, 'bookings for user:', userId);

    return NextResponse.json({
      success: true,
      bookings,
    });
  } catch (error: any) {
    console.error('[BOOKING] Error fetching bookings:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
