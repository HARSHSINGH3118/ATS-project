import React, { useState } from "react";
import { Loader2, LogIn, Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api/auth/login";

export default function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("Login response:", data);

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      localStorage.setItem("token", data.token);
      setToken(data.token); // ✅ update parent state
      navigate("/dashboard/kanban"); // ✅ redirect after login
    } catch (err) {
      console.error("Frontend login error:", err);
      alert(err.message || "❌ Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">
      <div className="flex w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-gray-200 dark:border-gray-700">
        
        {/* Left Panel */}
        <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-10">
          <h1 className="text-3xl font-bold">Mini ATS</h1>
          <p className="mt-3 text-blue-100 text-center">
            Manage candidates, track hiring progress, and analyze insights all in one place.
          </p>
        </div>

        {/* Right Panel */}
        <div className="flex-1 p-8">
          <form onSubmit={handleLogin} className="space-y-6 max-w-sm mx-auto">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
                <LogIn className="w-6 h-6 text-blue-600" /> Recruiter Login
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Sign in to access your ATS dashboard
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full pl-10 p-2 rounded-lg border dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-10 p-2 rounded-lg border dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed transition"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>

            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              Don’t have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:underline dark:text-blue-400">
                Create account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
