import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_PREFIXES = ['/game'];
const AUTH_ROUTES = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Read token flags
  const refreshToken = request.cookies.get('refreshToken')?.value;
  const isAuthenticated = Boolean(refreshToken);

  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  // Case 1: Unauthenticated user trying to access game pages -> Send to login
  if (!isAuthenticated && isProtected) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Case 2: Authenticated user trying to visit login/register -> Send back to dashboard
  // ONLY redirect if they are actually navigating directly to /login or /register
  if (isAuthenticated && isAuthRoute) {
    // If the browser URL contains an error or expired flag, do not redirect them away!
    // This allows them to cleanly clear out their state and log back in.
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