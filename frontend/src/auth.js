import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const getRole = async (email) => {
    const emailRequest = {"email": email}
    const roleResponse = await fetch("http://localhost:5000/api/employees/role", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(emailRequest)
    })
    const roleData = await(roleResponse.json())
    if (!roleData) {
      return null
    }
    return roleData[0].role
}

export const { handlers, signIn, signOut, auth } = NextAuth({ 
  providers: [Google({
    async profile(profile) {
      let role = await getRole(profile.email)
      if (!role) {
        role = "user"
      }
      return {role: role, email: profile.email, name: profile.name}
    }
  })],
  callbacks: {
    jwt({token,user}) {
      if (user) token.role = user.role
      return token
    },
    session({session, token}) {
      session.user.role = token.role
      return session
    },
    async redirect({url, baseUrl}) {
      return baseUrl
    }
  }
})

