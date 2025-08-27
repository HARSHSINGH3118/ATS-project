import React, { useState } from "react";

const API_URL = "http://localhost:5000/api/auth/register";

export default function Signup({ onSignup }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) throw new Error("Signup failed");

      const data = await res.json();
      localStorage.setItem("token", data.token); // ✅ save JWT
      onSignup();
    } catch (err) {
      console.error(err);
      alert("Signup failed, try again");
    }
  };

  return (
    <form
      onSubmit={handleSignup}
      className="p-6 max-w-sm mx-auto space-y-3 border rounded bg-white"
    >
      <h2 className="text-xl font-bold">Signup</h2>
      <input
        type="text"
        placeholder="Name"
        className="border p-2 w-full"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
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
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 w-full"
      >
        Signup
      </button>
    </form>
  );
}
