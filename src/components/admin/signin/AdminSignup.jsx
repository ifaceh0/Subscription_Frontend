import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function AdminSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const handleSignup = async (e) => {
    e.preventDefault();

    // Basic validation check
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/admin/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Signup failed");

      alert("Account created successfully!");
      navigate("/login");
    } catch (err) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="w-full max-w-md border border-gray-200 rounded-lg shadow-sm p-8">
        <div className="mb-10 text-left">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            Create Admin Account
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Join the portal to start managing your application.
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              placeholder="admin@hub.com"
              className="w-full px-3 py-2.5 bg-gray-50/50 border border-gray-200 rounded-md focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all text-sm"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full px-3 py-2.5 bg-gray-50/50 border border-gray-200 rounded-md focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all text-sm"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full px-3 py-2.5 bg-gray-50/50 border border-gray-200 rounded-md focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all text-sm"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex justify-center items-center w-full bg-violet-600 text-white py-2.5 rounded-md font-medium text-sm hover:bg-violet-700 active:bg-violet-800 transition-all shadow-sm disabled:opacity-80 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-[13px] text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-gray-900 font-semibold hover:text-violet-600 transition-colors">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}