import { authService } from '@/lib/auth/authService';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const session = await authService.login({ email, password });

    const response = NextResponse.json({
      user: session.user,
      token: session.token,
      expiresAt: session.expiresAt,
    });

    // Set token as HTTP cookie so it's sent with every request
    response.cookies.set('token', session.token, {
      maxAge: 24 * 60 * 60, // 24 hours in seconds
      httpOnly: false,
      secure: false, // Allow HTTP in development
      sameSite: 'lax',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
