import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";

const Login = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const authContext = useContext(AuthContext);

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
          name="password"/></div>
        <button type="submit" aria-disabled="false" className="flex h-10 w-full items-center justify-center rounded-md border text-sm transition-all focus:outline-none">Sign in<span aria-live="polite" className="sr-only" role="status">Submit form</span></button>
        <p className="text-center text-sm text-gray-600">Don't have an account? <a className="font-semibold text-gray-800" href="/register">Sign up</a> for free.</p>
      </form>
    </div>
    </div>
    
  );
}
{/* <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div> */}
export default Login;