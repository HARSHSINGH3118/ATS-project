import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Moon, Sun, LogOut } from "lucide-react";

export default function Navbar({ setToken }) {
  const [darkMode, setDarkMode] = useState(() => {
    return (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  const navigate = useNavigate();

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.theme = "dark";
    } else {
      root.classList.remove("dark");
      localStorage.theme = "light";
    }
  }, [darkMode]);

  const handleLogout = () => {
    setToken(null);
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    `px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-blue-600 text-white shadow"
        : "text-gray-800 dark:text-gray-200 hover:bg-gray-200/60 dark:hover:bg-gray-700/60"
    }`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Brand */}
        <div className="text-xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
          Mini ATS
        </div>

        {/* Right Side: Nav links + Actions */}
        <div className="flex items-center gap-6">
          {/* Navigation Links */}
          <NavLink to="/dashboard/kanban" className={navLinkClass}>
            Kanban
          </NavLink>
          <NavLink to="/dashboard/analytics" className={navLinkClass}>
            Analytics
          </NavLink>

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-gray-200/70 dark:bg-gray-700/70 hover:scale-105 transition"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-800 dark:text-gray-200" />
            )}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
