import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'sk-sure-wins-super-secret-key-2026');

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin Route auth is handled in the page.tsx itself (renders AdminLogin)

  // Protect VIP Dashboard Route
  if (pathname.startsWith('/vip-dashboard')) {
    const vipSession = request.cookies.get('sk_vip_session');
    if (!vipSession) {
      return NextResponse.redirect(new URL('/', request.url)); // Redirect to home
    }
    try {
      await jwtVerify(vipSession.value, JWT_SECRET);
    } catch {
      return NextResponse.redirect(new URL('/', request.url)); // Redirect if tampered/invalid
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/vip-dashboard/:path*'],
};
