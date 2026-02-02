import { db } from '@/lib/mongodb/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const workshopId = request.nextUrl.searchParams.get('workshopId');

    let feedbackData;

    if (workshopId) {
      feedbackData = await db.feedback.findByWorkshop(workshopId);
    } else {
      feedbackData = await db.feedback.findAll();
    }

    return NextResponse.json(feedbackData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const feedback = await db.feedback.create({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(feedback, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
