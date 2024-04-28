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
  </div>
  </body>
  </html>
`

export default auth(async (req) => {
  if (!req.auth) {
    console.log("USER NOT AUTHENTICATED")
    return NextResponse.redirect(new URL('/test', req.url))
  }
  console.log(req.auth)

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

export const config = {
  matcher: ["/employee/:path*"],
}
