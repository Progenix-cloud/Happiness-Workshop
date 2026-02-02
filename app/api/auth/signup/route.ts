import { authService } from '@/lib/auth/authService';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role } = await request.json();

    if (!email || !password || !name || !role) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 });
    }

    const session = await authService.signup({ email, password, name, role });

    return NextResponse.json({
      user: session.user,
      token: session.token,
      expiresAt: session.expiresAt,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
