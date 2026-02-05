import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Create response that clears the token cookie
    const response = NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    );

    // Clear the token cookie
    response.cookies.set({
      name: 'token',
      value: '',
      maxAge: 0, // This immediately expires the cookie
      httpOnly: false,
      sameSite: 'lax',
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}
