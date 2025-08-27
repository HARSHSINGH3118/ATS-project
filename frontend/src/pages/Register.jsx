import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, Mail, Lock, User } from "lucide-react"; // npm install lucide-react

const API_URL = "http://localhost:5000/api/auth/register";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (res.ok) {
        alert("✅ Registration successful! Please login.");
        navigate("/login");
      } else {
        const data = await res.json();
        alert(data.error || "❌ Registration failed");
      }
    } catch (err) {
      console.error("Register error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">
      <div className="flex w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-gray-200 dark:border-gray-700">
        
        {/* Left branding panel */}
        <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-green-600 to-emerald-700 text-white p-10">
          <h1 className="text-3xl font-bold">Join Mini ATS</h1>
          <p className="mt-3 text-green-100 text-center">
            Create your recruiter account and start tracking candidates today.
          </p>
        </div>

        {/* Right form panel */}
        <div className="flex-1 p-8">
          <form onSubmit={handleSubmit} className="space-y-6 max-w-sm mx-auto">
            {/* Header */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
                <UserPlus className="w-6 h-6 text-green-600" /> Create Account
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Register to access your ATS dashboard
              </p>
            </div>

            {/* Name */}
            <div className="relative">
              <User className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 p-2 rounded-lg border dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 p-2 rounded-lg border dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 p-2 rounded-lg border dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition"
            >
              Register
            </button>

            {/* Already have account */}
            <p className="text-sm text-center text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-green-600 hover:underline dark:text-green-400"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
