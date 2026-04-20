import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get('token')?.value;
  const userRole = request.cookies.get('userRole')?.value;

  const isAuthenticated = !!(token && userRole && token !== "" && userRole !== "");

  // Allow access to login/signup when not authenticated
  if (pathname.startsWith('/login') || pathname.startsWith('/signup')) {
    if (isAuthenticated) {
      const destination = userRole === 'ADMIN' ? '/admin/dashboard' : '/dashboard';
      return NextResponse.redirect(new URL(destination, request.url));
    }
    return NextResponse.next();
  }

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const isAdmin = userRole === 'ADMIN';

  if (isAdmin && !pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  // Block non-admins from /admin routes
  if (pathname.startsWith('/admin') && !isAdmin) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|assets|manifest.json|robots.txt).*)',
  ],
};
