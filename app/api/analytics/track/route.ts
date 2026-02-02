import { NextRequest, NextResponse } from 'next/server';

interface AnalyticsEvent {
  eventType: string;
  userId: string;
  workshopId?: string;
  metadata?: Record<string, string | number | boolean>;
  timestamp: string;
}

// In-memory storage for demo (replace with database in production)
let analyticsEvents: AnalyticsEvent[] = [];

export async function POST(request: NextRequest) {
  try {
    const event: AnalyticsEvent = await request.json();

    // Validate event
    if (!event.eventType || !event.userId) {
      return NextResponse.json(
        { error: 'Missing required fields: eventType, userId' },
        { status: 400 }
      );
    }

    // Add timestamp if not provided
    const trackingEvent: AnalyticsEvent = {
      ...event,
      timestamp: event.timestamp || new Date().toISOString()
    };

    // Store event
    analyticsEvents.push(trackingEvent);

    // Log tracking
    console.log('[v0] Analytics event tracked:', {
      eventType: event.eventType,
      userId: event.userId,
      workshopId: event.workshopId,
      timestamp: trackingEvent.timestamp
    });

    return NextResponse.json({
      success: true,
      eventId: `evt_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      message: 'Event tracked successfully'
    });
  } catch (error) {
    console.error('[v0] Analytics tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const eventType = searchParams.get('eventType');
    const userId = searchParams.get('userId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Filter events
    let filtered = analyticsEvents;

    if (eventType) {
      filtered = filtered.filter(e => e.eventType === eventType);
    }

    if (userId) {
      filtered = filtered.filter(e => e.userId === userId);
    }

    if (startDate && endDate) {
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();
      filtered = filtered.filter(e => {
        const eventTime = new Date(e.timestamp).getTime();
        return eventTime >= start && eventTime <= end;
      });
    }

    // Calculate summary
    const summary = {
      totalEvents: filtered.length,
      eventTypes: [...new Set(filtered.map(e => e.eventType))],
      uniqueUsers: [...new Set(filtered.map(e => e.userId))].length,
      dateRange: {
        from: filtered.length > 0 ? filtered[0].timestamp : null,
        to: filtered.length > 0 ? filtered[filtered.length - 1].timestamp : null
      },
      events: filtered.slice(-100) // Return last 100 events
    };

    return NextResponse.json(summary);
  } catch (error) {
    console.error('[v0] Analytics retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve analytics' },
      { status: 500 }
    );
  }
}
