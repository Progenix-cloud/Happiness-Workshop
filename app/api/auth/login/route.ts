import { authService } from '@/lib/auth/authService';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const session = await authService.login({ email, password });

    return NextResponse.json({
      user: session.user,
      token: session.token,
      expiresAt: session.expiresAt,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
