import { NextResponse } from 'next/server'
import { jwtDecode } from 'jwt-decode'
 
// This function can be marked `async` if using `await` inside
export async function middleware(request) {
  const whitelist = [ 
    'cadewya@tamu.edu',
    'adityabiradar25@tamu.edu',
    'isaacambro@tamu.edu',
    'karanbhalla204@tamu.edu',
    'sukelv0802@tamu.edu',
    'kjain@tamu.edu'
  ]
  let cookie = request.cookies.get('access_token')
  if (!cookie) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  let token = cookie['value']
  const decoded = jwtDecode(token)
  const email = decoded.email
  if (!whitelist.includes(email)) {
    return NextResponse.redirect(new URL('/', request.url))
  }
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: '/employee/:path*',
}
