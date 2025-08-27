import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import KanbanBoard from "./components/KanbanBoard";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Navbar from "./components/Navbar";
import AnalyticsDashboard from "./components/AnalyticsDashboard"; // ✅ renamed to match component

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  return (
    <>
      {isAuthenticated && <Navbar />} {/* Navbar only when logged in */}

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <Routes>
          {/* Auth Routes */}
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" />
              ) : (
                <Login onLogin={() => setIsAuthenticated(true)} />
              )
            }
          />
          <Route
            path="/signup"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" />
              ) : (
                <Signup onSignup={() => setIsAuthenticated(true)} />
              )
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? <KanbanBoard /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/analytics"
            element={
              isAuthenticated ? <AnalyticsDashboard /> : <Navigate to="/login" />
            }
          />

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
