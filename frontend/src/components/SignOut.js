import { signOut } from "@/auth"
import Image from "next/image"
import React from "react"
import Link from "next/link"
import { redirect } from "next/navigation"

export function SignOut({ email }) {
  return (
    <main className="h-full min-h-screen min-w-screen flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center mb-12">
        <h1 className="text-4xl font-bold text-black shadow-lg p-5 rounded-lg">You are currently logged in as {email}. Click below to log out.</h1>
        <Image alt="Rev logo" className="mt-4" src={"/revs.png"} width={120} height={120}></Image>
      </div>
      <form
        action={async () => {
          "use server"
          await signOut("google", { callbackUrl: "http://localhost:3000/" })
        }}
        className="flex flex-col items-center gap-6"
      >
        <button type="submit" className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg px-6 py-3 text-center inline-flex items-center shadow-lg transition-colors duration-200">
          <svg className="w-6 h-6 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 19">
            <path fillRule="evenodd" d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z" clipRule="evenodd" />
          </svg>
          Sign out with Google
        </button>
        <Link href="/" className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg px-6 py-3 focus:outline-none shadow-lg transition-colors duration-200">Home</Link>
      </form>
    </main>
  )
} 
