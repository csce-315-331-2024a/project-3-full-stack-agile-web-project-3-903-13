import { NextResponse } from 'next/server'
import { jwtDecode } from 'jwt-decode'
 
// This function can be marked `async` if using `await` inside
export async function middleware(request) {
  const managers = [ 
    'cadewya@tamu.edu',
    'adityabiradar25@tamu.edu',
    'isaacambro@tamu.edu',
    'karanbhalla204@tamu.edu',
    'sukelv0802@tamu.edu',
    'kjain@tamu.edu'
  ]

  const cashiers = [
    'wyattrcade@gmail.com',
    'isaacambro@gmail.com',
    'karanbhalla204@gmail.com',
    'sukelv0802@gmail.com'
  ]

  let cookie = request.cookies.get('access_token')
  if (!cookie) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  let token = cookie['value']
  const decoded = jwtDecode(token)
  const email = decoded.email
  if (request.nextUrl.pathname.startsWith('/employee/manager')) {
    if (!managers.includes(email)) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  } else {
    if (!cashiers.includes(email) && !managers.includes(email)) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: '/employee/:path*',
}
