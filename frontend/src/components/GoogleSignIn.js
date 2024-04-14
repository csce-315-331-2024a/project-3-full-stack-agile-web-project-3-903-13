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
    />
  )
}

const SignOutButton = () => {
  const [cookies, setCookie] = useCookies('access_token')
  const clearCookie = () => {
    setCookie('access_token', null)
  }
  return (
    <button onClick={clearCookie}>
      sign out
    </button>
  );
}

export {GoogleSignInButton,SignOutButton}
