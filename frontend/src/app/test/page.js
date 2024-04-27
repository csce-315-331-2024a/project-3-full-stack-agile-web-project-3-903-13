import React from "react"
import { SignIn } from "@/components/SignIn"
import { auth } from "@/auth"

const Page = async () => {
	const session = await auth()
	console.log(session)
	return (
		<SignIn/>
	)
}

export default Page
