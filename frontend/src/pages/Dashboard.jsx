import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import KanbanBoard from "../components/KanbanBoard";
import AnalyticsDashboard from "../components/AnalyticsDashboard";

export default function Dashboard({ setToken }) {
  return (
    <div className="flex flex-col h-screen">
      {/* Sticky Navbar */}
      <Navbar setToken={setToken} />

      {/* Main Content */}
      <main className="flex-1 pt-20 px-6 bg-gray-100 dark:bg-gray-900 overflow-y-auto">
        <Routes>
          <Route path="kanban" element={<KanbanBoard />} />
          <Route path="analytics" element={<AnalyticsDashboard />} />
        </Routes>
      </main>
    </div>
  );
}
