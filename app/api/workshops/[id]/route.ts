import { db } from '@/lib/mongodb/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const workshop = await db.workshops.findById(params.id);

    if (!workshop) {
      return NextResponse.json({ error: 'Workshop not found' }, { status: 404 });
    }

    return NextResponse.json(workshop);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();

    const updated = await db.workshops.update(params.id, {
      ...data,
      updatedAt: new Date(),
    });

    if (!updated) {
      return NextResponse.json({ error: 'Workshop not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = await db.workshops.delete(params.id);

    if (!deleted) {
      return NextResponse.json({ error: 'Workshop not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Workshop deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
