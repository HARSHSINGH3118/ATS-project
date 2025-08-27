import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navLinks = [
    { to: "/dashboard", label: "Kanban" },
    { to: "/analytics", label: "Analytics" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Left: Logo */}
        <Link
          to="/dashboard"
          className="text-2xl font-extrabold text-yellow-400 tracking-wide hover:scale-105 transition-transform"
        >
          ATS Dashboard
        </Link>

        {/* Right: Nav links + controls */}
        <div className="flex items-center gap-6">
          {/* Navigation Links */}
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`relative px-2 py-1 font-medium transition-colors
                ${
                  location.pathname === link.to
                    ? "text-yellow-400 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-yellow-400 after:rounded-full"
                    : "text-gray-300 hover:text-yellow-300"
                }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-all"
          >
            {darkMode ? "🌙" : "☀️"}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full shadow-md transition-all"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
