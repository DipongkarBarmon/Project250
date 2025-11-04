import { NextResponse } from 'next/server'

export async function middleware(request) {
  // Simple middleware - no authentication check needed here
  // Authentication is handled in API routes via JWT cookies
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
