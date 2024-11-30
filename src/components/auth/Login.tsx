import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
// import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import MotionButton from "../common/button/MotionButton";

const Login = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const authContext = useContext(AuthContext);

  const redirectUri = import.meta.env.VITE_REDIRECT_URI;
  const clientId = import.meta.env.VITE_CLIENT_ID;

  const googleOAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&client_id=${encodeURIComponent(
    clientId
  )}&scope=${encodeURIComponent(
    'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid'
  )}&access_type=offline`;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (authContext) {
      try {
        await authContext.login(username, password);
      }
      catch (error: any) {
        setErrorMessage('Invalid email or password');
      }
    }
  };
  // Form validation function
  const validateForm = (): boolean => {
    if (username.trim() === '' || password.trim() === '') {
      setErrorMessage('Username and password are required');
      return false;
    }
    return true;
  };

  return (
    <div className="flex align-middle justify-center h-screen">
      <div className="z-10 self-center w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl" >
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16" >
          <h3 className="text-xl font-semibold">Sign In</h3>
          <p className="text-sm text-gray-500">Use your email and password to sign in</p>
        </div>
        {errorMessage && <div className="flex align-middle justify-center rounded-lg bg-neutral-800 px-4 py-2 text-neutral-200 hover:bg-neutral-700">
          <p className="self-center">{errorMessage}</p>
        </div>}
       <form onSubmit={handleSubmit} className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 sm:px-16">
          <div>
            <label className="block text-xs text-gray-600 uppercase">Email Address</label>
            <input placeholder="user@reuzit.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
              type="email"
              name="email" /></div>
          <div>
            <label className="block text-xs text-gray-600 uppercase">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
              type="password"
              name="password" /></div>
          <MotionButton
            type="submit"
            className="flex h-10 bg-black w-full items-center justify-center rounded-md border text-sm">Sign in</MotionButton>
          <p className="text-center text-sm text-gray-600">Don't have an account? <Link className="font-semibold text-gray-800" to="/register">Sign up</Link> for free.</p>
          <a href={googleOAuthUrl}>
          <MotionButton type="button" 
          className="text-white w-full  bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between mr-2 mb-2">
            <svg className="mr-2 -ml-1 w-4 h-4"focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>Sign in with Google<div></div></MotionButton>
          </a>
        </form>
    </div>
    </div>

  );
}
export default Login;