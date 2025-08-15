import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Redirect API calls to the Express server
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const url = request.nextUrl.clone()
    url.host = 'localhost'
    url.port = '5000'
    url.protocol = 'http'
    
    return NextResponse.rewrite(url)
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}