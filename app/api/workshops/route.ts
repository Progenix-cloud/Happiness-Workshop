import { db } from '@/lib/mongodb/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const category = request.nextUrl.searchParams.get('category');
    const trainer = request.nextUrl.searchParams.get('trainer');

    let workshops = await db.workshops.findAll();

    if (category) {
      workshops = workshops.filter((w) => w.category === category);
    }

    if (trainer) {
      workshops = workshops.filter((w) => w.trainer === trainer);
    }

    return NextResponse.json(workshops);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const workshop = await db.workshops.create({
      ...data,
      registrations: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(workshop, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
