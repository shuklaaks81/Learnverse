import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  // DISABLED: Allow all traffic through
  // Maintenance mode disabled
  return NextResponse.next();
}

export const config = {
  // DISABLED: matcher to allow all routes
  matcher: [],
};
