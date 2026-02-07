import { NextRequest, NextResponse } from 'next/server';

// POST: Create notification
// GET: Get user's notifications
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    console.log('Creating notification:', data);

    const notification = {
      ...data,
      _id: Math.random().toString(36).substr(2, 9),
      isRead: false,
      createdAt: new Date(),
    };

    // In a real app, save to database

    return NextResponse.json({
      success: true,
      notification,
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // In a real app, get userId from session and fetch their notifications
    const mockNotifications: any[] = [];

    return NextResponse.json({
      success: true,
      notifications: mockNotifications,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}
