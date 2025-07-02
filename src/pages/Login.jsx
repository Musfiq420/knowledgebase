import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { handleGoogleLogin } from '../services/api';



function Login({ onLoginSuccess }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  const accessToken = hashParams.get("access_token");
    
    if (accessToken) {
      
      const login = async () => {
        
        const data = await handleGoogleLogin(accessToken);  // ✅ Await it here
        console.log("Login response:", data.key);
        if (data?.key) {
          toast.success("Login successful");
          localStorage.setItem('https://knowledgebase-xi.vercel.app/token/', data.key)
          onLoginSuccess()
        } else {
          toast.error("Login failed");
        }
      };
      login();
    } else {
      // toast.error("Login failed");
    }
  }, []);

  const loginWithGoogle = (e) => {
        e.preventDefault();
        window.location.href = import.meta.env.VITE_GOOGLE_LINK;
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Knowledgebase
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={loginWithGoogle}>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in with Google
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
