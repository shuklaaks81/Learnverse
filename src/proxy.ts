import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  // Allow owner if cookie is set
  const ownerCookie = request.cookies.get('owner');
  if (ownerCookie && ownerCookie.value === 'true') {
    return NextResponse.next();
  }
  // Redirect all other traffic to /maintenance
  return NextResponse.rewrite(new URL('/maintenance', request.url));
}

export const config = {
  matcher: [
    '/((?!_next|favicon.ico|maintenance).*)',
  ],
};
