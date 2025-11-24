import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Only enable maintenance mode on Vercel
  if (process.env.VERCEL === '1') {
    // Allow direct access to /maintenance and static files
    if (
      request.nextUrl.pathname.startsWith('/maintenance') ||
      request.nextUrl.pathname.startsWith('/_next') ||
      request.nextUrl.pathname.startsWith('/favicon') ||
      request.nextUrl.pathname.startsWith('/icon') ||
      request.nextUrl.pathname.startsWith('/manifest') ||
      request.nextUrl.pathname.startsWith('/api')
    ) {
      return NextResponse.next();
    }
    // Redirect all other routes to /maintenance
    return NextResponse.redirect(new URL('/maintenance', request.url));
  }
  return NextResponse.next();
}
