"use client";
import { GoogleLogin } from '@react-oauth/google';
import {useCookies} from 'react-cookie'

//const clientId = process.env.AUTH_GOOGLE_ID
const clientId = '821375678963-ors2l4rh0gpqqlmq3p8ddg9pptv5fsqi.apps.googleusercontent.com'
const GoogleSignInButton = () => {
  const [cookies, setCookie] = useCookies('access_token')
  return (
    <GoogleLogin 
      clientId={clientId}
      onSuccess={credentialResponse => {
        console.log(credentialResponse);
        setCookie('access_token', credentialResponse.credential)
      }}
      onError={() => {
        console.log('Login Failed');
      }}
      aria-label="Google Sign In Button"
    />
  )
}

const SignOutButton = () => {
  const [cookies, setCookie] = useCookies('access_token')
  const clearCookie = () => {
    setCookie('access_token', null)
  }
  return (
    <button onClick={clearCookie} className="px-4 py-2 w-full right-0 border flex flex-col justify-center align-center gap-2 border-slate-200 dark:border-slate-700 rounded-lg hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150 text-center"
      aria-label= "Sign out Button"
    >
        <span className='flex flex-col justify-center align-center'>Sign Out</span>
    </button>
  );
}

export {GoogleSignInButton,SignOutButton}
