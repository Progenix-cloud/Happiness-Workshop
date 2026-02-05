import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const pathname = request.nextUrl.pathname;

  // Protect dashboard routes - redirect to home if no token
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Don't auto-redirect / to /dashboard here
  // Let the client-side page.tsx handle the redirect when user is logged in
  // This prevents redirect loops when logging out

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).)*'],
};
