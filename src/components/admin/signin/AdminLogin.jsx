import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // New loading state
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    try {
      const res = await fetch(`${API_BASE}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Invalid credentials");

      const data = await res.json();
      localStorage.setItem("token", data.token);
      navigate("/admin");
    } catch (err) {
      alert(err.message);
    } finally {
      setIsLoading(false); // Stop loading regardless of outcome
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="w-full max-w-md border border-gray-200 rounded-lg shadow-sm p-8">
        <div className="mb-10 text-left">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            Admin Portal
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Sign in to manage your application.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              placeholder="e.g. admin@hub.com"
              className="w-full px-3 py-2.5 bg-gray-50/50 border border-gray-200 rounded-md focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all placeholder:text-gray-400 text-sm"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[13px] font-medium text-gray-700">Password</label>
              {/* <a href="#" className="text-[12px] text-violet-600 hover:text-violet-700 font-medium">
                Forgot?
              </a> */}
            </div>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full px-3 py-2.5 bg-gray-50/50 border border-gray-200 rounded-md focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all placeholder:text-gray-400 text-sm"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="relative w-flex flex justify-center items-center w-full bg-violet-600 text-white py-2.5 rounded-md font-medium text-sm hover:bg-violet-700 active:bg-violet-800 transition-all shadow-sm disabled:opacity-80 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <svg 
                className="animate-spin h-5 w-5 text-white" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle 
                  className="opacity-25" 
                  cx="12" cy="12" r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                ></circle>
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              "Continue"
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-[13px] text-gray-500">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-gray-900 font-semibold hover:text-violet-600 transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}