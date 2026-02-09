import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email/emailService';
import { db } from '@/lib/mongodb/db';

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

    // Get the workshop using db abstraction
    const workshop = await db.workshops.findById(workshopId);
    if (!workshop) {
      return NextResponse.json(
        { error: 'Workshop not found' },
        { status: 404 }
      );
    }

    console.log('[BOOKING] Found workshop:', workshop.title);
    console.log('[BOOKING] Current registrations:', workshop.registrations);

    console.log('[BOOKING] Found workshop:', workshop.title);
    console.log('[BOOKING] Current registrations:', workshop.registrations);

    // Get user details
    const user = await db.users.findById(userId);
    const userEmail = user?.email || registrationDetails?.email || 'participant@happiness.com';
    const userName = user?.name || registrationDetails?.fullName || 'User';

    // Check if already registered
    const existingRegistration = workshop.registrations?.find(
      r => r.userId === userId
    );

    if (existingRegistration) {
      // Update status instead of creating new
      console.log('[BOOKING] Updating existing registration, old status:', existingRegistration.status, 'new status:', status);
      existingRegistration.status = status;
      existingRegistration.registrationDetails = registrationDetails;
      existingRegistration.registeredAt = new Date();
    } else {
      // Create new registration
      console.log('[BOOKING] Creating new registration with status:', status);
      const registration = {
        userId,
        status,
        registrationDetails,
        registeredAt: new Date(),
      };

      if (!workshop.registrations) {
        workshop.registrations = [];
      }
      workshop.registrations.push(registration);

      // Update current enrollment only for booked status
      if (status === 'booked') {
        workshop.currentEnrollment = (workshop.currentEnrollment || 0) + 1;
      }
    }

    // Update the workshop in the database
    await db.workshops.update(workshopId, { 
      registrations: workshop.registrations,
      currentEnrollment: workshop.currentEnrollment,
    });

    console.log('[BOOKING] Registration successful for user:', userId, 'workshop:', workshopId, 'status:', status);
    console.log('[BOOKING] Updated registrations:', workshop.registrations);

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

    // Get all workshops and filter bookings
    const workshops = await db.workshops.findAll();
    const bookings: any[] = [];

    workshops.forEach(workshop => {
      const registration = workshop.registrations?.find(r => r.userId === userId);
      if (registration) {
        bookings.push({
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
