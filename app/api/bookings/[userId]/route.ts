import { NextRequest, NextResponse } from 'next/server';

const mockBookings = [
  {
    _id: '1',
    workshopId: 'w1',
    workshopTitle: 'My Happiness Journey Starts Here',
    trainer: 'Dr. Sarah Johnson',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    time: '10:00 AM',
    location: 'Delhi',
    status: 'booked' as const,
    registeredAt: new Date().toISOString(),
  },
  {
    _id: '2',
    workshopId: 'w2',
    workshopTitle: 'Stress Management Mastery',
    trainer: 'Prof. Raj Kumar',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    time: '2:00 PM',
    location: 'Mumbai',
    status: 'attended' as const,
    registeredAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: '3',
    workshopId: 'w3',
    workshopTitle: 'Inner Joy & Mindfulness',
    trainer: 'Maya Sharma',
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    time: '5:00 PM',
    location: 'Bangalore',
    status: 'interested' as const,
    registeredAt: new Date().toISOString(),
  },
];

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    // Return mock bookings
    return NextResponse.json(mockBookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
