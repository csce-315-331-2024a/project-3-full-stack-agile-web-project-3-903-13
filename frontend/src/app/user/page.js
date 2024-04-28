import React from "react"
import { SignIn } from "@/components/SignIn"
import { SignOut } from "@/components/SignOut"
import { auth } from "@/auth"

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
