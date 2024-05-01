import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

/**
 * Fetches the role of a user based on their email from a backend API.
 * This function sends a POST request to the API with the user's email and receives the role information.
 *
 * @module AuthUtilities
 * @param {string} email - User's email address to fetch the role from the backend.
 * @returns {Promise<string|null>} - Returns the user's role as a string or null if the role is not found or an error occurs.
 */
export const getRole = async (email) => {
    const emailRequest = {"email": email}
    const roleResponse = await fetch("https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/employees/role", {
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

/**
 * Configures NextAuth for handling OAuth authentication and session management with Google as a provider.
 * The configuration includes customizing the user profile to fetch roles using the `getRole` function,
 * adjusting JWT and session callbacks to include the user's role, and handling redirections.
 *
 * @memberOf module:AuthUtilities
 * @function
 * @returns {Object} - An object containing NextAuth handlers and functions like signIn, signOut, and auth.
 */
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

