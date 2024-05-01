import {auth} from "@/auth"
import { redirect } from "next/dist/server/api-utils"
import { NextResponse } from 'next/server'
import {getRole} from "./auth"

const unauthorizedHTML = `
  <html>
  <body style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
  <div style="display: flex; flex-direction: column; align-items: center">
  <h1>Error 401</h1>
  <h1>You are not allowed to access this resource</h1>
  <a href="/employee">Back</a>
  </div>
  </body>
  </html>
`
/**
 * Middleware for role-based authorization in a Next.js application.
 * It checks the user's role and determines if they have the appropriate permissions
 * to access specific paths within the application.
 *
 * @module AuthMiddleware
 * @param {Object} req - The incoming request object provided by Next.js. Contains user authentication and URL information.
 * @returns {NextResponse} - Returns a Next.js response object to either continue with the request or to redirect/block with a custom response.
 * 
 * Paths and corresponding required roles:
 * - `/employee/manager/users`: Only 'admin' can access.
 * - `/employee/manager/kitchen`: Accessible by 'admin', 'kitchen', and 'manager' roles.
 * - `/employee/manager/*`: Accessible by 'admin' and 'manager' roles.
 * - `/employee/*`: Accessible by 'admin', 'kitchen', 'cashier', and 'manager' roles.
 * 
 * Redirects unauthenticated users to the login page and unauthorized users to an error page.
 */
export default auth(async (req) => {
  if (!req.auth) {
    return NextResponse.redirect(new URL('/user', req.url))
  }

  let userEmail = req.auth.user.email
  let role;
  if (!req.auth.user.role) {
    role = await getRole(userEmail)
  } else {
    role = req.auth.user.role
  }
  // Query role of user with corresponding email in database
  // Cases: 
  //    - /employee/manager/users: Only admin can access this
  //    - /employee/manager/kitchen: Manager/Admin/Kitchen
  //    - /employee/manager/*: Must be manager or admin
  //    - /employee/*: Must be at least a cashier
  //    Go by longest prefix match


  if (req.nextUrl.pathname.startsWith('/employee/manager/users')) {
    if (role != "admin") {
      return new NextResponse(
        unauthorizedHTML,
        {status: 401, headers: {'content-type': 'text/html'}}
      )
    }
    return 
  } else if (req.nextUrl.pathname.startsWith('/employee/manager/kitchen')) {
    if (role != "admin" && role != "kitchen" && role != "manager") {
      return new NextResponse(
        unauthorizedHTML,
        {status: 401, headers: {'content-type': 'text/html'}}
      )
    }
    return 
  } else if (req.nextUrl.pathname.startsWith('/employee/manager/')) {
    if (role != "admin" && role != "manager") {
      return new NextResponse(
        unauthorizedHTML,
        {status: 401, headers: {'content-type': 'text/html'}}
      )
    }
    return 
  } else if (req.nextUrl.pathname.startsWith('/employee')) {
    if (role != "admin" && role != "kitchen" && role != "cashier" && role != "manager") {
      return new NextResponse(
        unauthorizedHTML,
        {status: 401, headers: {'content-type': 'text/html'}}
      )
    }
    return 
  }
})

/**
 * Configuration for the middleware to apply it only to paths under '/employee/'.
 * @memberOf module:AuthMiddleware
 * @type {Object}
 */
export const config = {
  matcher: ["/employee/:path*"],
}
