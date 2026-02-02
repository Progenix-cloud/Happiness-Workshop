import { db } from '@/lib/mongodb/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const certificates = await db.certificates.findByUser(userId);
    return NextResponse.json(certificates);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
