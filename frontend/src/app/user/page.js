/**
 * @module UserManagement/Page
 * @description Page component that determines whether to display SignIn or SignOut based on authentication status.
 */
import React from "react"
import { SignIn } from "@/components/SignIn"
import { SignOut } from "@/components/SignOut"
import { auth } from "@/auth"

/**
 * Asynchronously determines and renders the appropriate authentication-related component.
 * It uses the current authentication state to decide.
 *
 * @async
 * @function Page
 * @returns {Promise<React.Component>} A promise that resolves to either a SignOut or SignIn component.
 */
const Page = async () => {
	const session = await auth()
	console.log(session)
	return (
		session
		? <SignOut email={session.user.email}/>
		: <SignIn/>
		
	)
}

export default Page
