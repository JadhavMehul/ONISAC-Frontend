import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_PREFIXES = ['/game'];
const AUTH_ROUTES = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProd = process.env.NODE_ENV === 'production';
  
  // Read token flags
  const refreshToken = request.cookies.get('refreshToken')?.value;
  
  // 🛡️ DEV BYPASS: If we are testing locally and Chrome is blocking cookies across devices, 
  // we can check if the request has a temporary dev override query param or fallback header.
  let isAuthenticated = Boolean(refreshToken);
  
  if (!isProd && !isAuthenticated) {
    // If we're in dev mode and cookies failed, look for a bypass flag to let you test on your phone
    const hasDevBypass = request.nextUrl.searchParams.has('dev_login') || 
                         request.headers.get('referer')?.includes('dashboard');
    if (hasDevBypass) {
      isAuthenticated = true; 
    }
  }

  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  // Case 1: Unauthenticated user trying to access game pages -> Send to login
  if (!isAuthenticated && isProtected) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Case 2: Authenticated user trying to visit login/register -> Send back to dashboard
  if (isAuthenticated && isAuthRoute) {
    if (request.nextUrl.searchParams.has('session_expired') || request.nextUrl.searchParams.has('reauth_required')) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/game/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|assets|api).*)'],
};