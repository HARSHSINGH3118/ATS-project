import React, { useState } from "react";

const API_URL = "http://localhost:5000/api/auth/login";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Login failed");

      const data = await res.json();
      localStorage.setItem("token", data.token); // ✅ save JWT
      onLogin();
    } catch (err) {
      console.error(err);
      alert("Invalid credentials");
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="p-6 max-w-sm mx-auto space-y-3 border rounded bg-white"
    >
      <h2 className="text-xl font-bold">Login</h2>
      <input
        type="email"
        placeholder="Email"
        className="border p-2 w-full"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="border p-2 w-full"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full"
      >
        Login
      </button>
    </form>
  );
}
