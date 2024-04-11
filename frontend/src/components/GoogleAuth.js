import { GoogleOAuthProvider } from '@react-oauth/google'
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'

const clientId = "821375678963-ors2l4rh0gpqqlmq3p8ddg9pptv5fsqi.apps.googleusercontent.com"

const whiteListed = [
  "cadewya@tamu.edu",
  "adityabiradar25@tamu.edu",
  "isaacambro@tamu.edu",
  "karanbhalla204@tamu.edu",
  "sukelv0802@tamu.edu",
  "kjain@tamu.edu"
]

function Login() {
  const onSuccess = (res) => {
    const decoded = jwtDecode(res.credential)
    if (whiteListed.includes(decoded.email)) {
      console.log("You're in")
    } else {
      console.log("nahhhh")
    }
  }
  const onFailure = (res) => {
    console.log("LOGIN FAILED")
  }
  return (
    <GoogleLogin
      clientId={clientId}
      buttonText="Login"
      onSuccess={onSuccess}
      onFailuer={onFailure}
      cookiePolicy={'single_host_origin'}
      isSignedIn={false}
    />
  )
}

export default Login

