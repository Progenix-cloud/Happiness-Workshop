import { db } from '@/lib/mongodb/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const analytics = await db.analytics.get();
    const users = await db.users.findAll();
    const workshops = await db.workshops.findAll();
    const testimonials = await db.testimonials.findAll();

    // Calculate metrics
    const totalUsers = users.length;
    const totalWorkshops = workshops.length;
    const totalAttendances = workshops.reduce(
      (sum, w) => sum + w.registrations.filter((r) => r.status === 'attended').length,
      0
    );
    const averageHappiness =
      users.reduce((sum, u) => sum + u.happinessScore, 0) / users.length || 0;
    const avgRating =
      testimonials.length > 0
        ? testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length
        : 0;

    return NextResponse.json({
      ...analytics,
      totalUsers,
      totalWorkshops,
      totalAttendances,
      averageHappiness: Math.round(averageHappiness * 100) / 100,
      avgRating: Math.round(avgRating * 100) / 100,
      testimonialCount: testimonials.length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
