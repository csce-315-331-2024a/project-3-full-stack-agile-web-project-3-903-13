import {auth} from "@/auth"
import { NextResponse } from 'next/server'

export default auth(async (req) => {
  if (!req.auth) {
    console.log("USER NOT AUTHENTICATED")
    return NextResponse.redirect(new URL('/api/auth/signin', req.url))
  }

  let userEmail = req.auth.user.email
  // Query role of user with corresponding email in database
  // Cases: 
  //    - /employee/manager/users: Only admin can access this
  //    - /employee/manager/kitchen: Manager/Admin/Kitchen
  //    - /employee/manager/*: Must be manager or admin
  //    - /employee/*: Must be at least a cashier
  //    Go by longest prefix match
  console.log(userEmail)
})

export const config = {
  matcher: ["/employee/:path*"],
}
