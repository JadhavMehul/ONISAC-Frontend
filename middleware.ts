
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const refreshToken = request.cookies.get('refreshToken'); // Defined in cookies.js
  const { pathname } = request.nextUrl;

  // Protect dashboard routes
  if (!refreshToken && pathname.startsWith('/game/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Prevent logged-in users from seeing login/register
  if (refreshToken && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/game/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/game/dashboard/:path*', '/login', '/register'],
};