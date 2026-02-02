import { db } from '@/lib/mongodb/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const workshopId = request.nextUrl.searchParams.get('workshopId');

    let testimonialsData;

    if (workshopId) {
      testimonialsData = await db.testimonials.findByWorkshop(workshopId);
    } else {
      testimonialsData = await db.testimonials.findAll();
    }

    return NextResponse.json(testimonialsData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const testimonial = await db.testimonials.create({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(testimonial, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
