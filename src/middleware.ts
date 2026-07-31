import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin Route auth is handled in the page.tsx itself (renders AdminLogin)

  // Protect VIP Dashboard Route
  if (pathname.startsWith('/vip-dashboard')) {
    const vipSession = request.cookies.get('sk_vip_session');
    if (!vipSession) {
      return NextResponse.redirect(new URL('/', request.url)); // Redirect to home
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/vip-dashboard/:path*'],
};
