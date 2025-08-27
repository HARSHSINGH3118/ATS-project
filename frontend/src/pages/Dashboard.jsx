import React, { useState } from "react";
import Navbar from "../components/Navbar";
import KanbanBoard from "../components/KanbanBoard";
import AddCandidateForm from "../components/AddCandidateForm";

export default function Dashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshBoard = () => setRefreshKey((prev) => prev + 1);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Navbar />
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Job Applications</h1>
          <button
            onClick={() => setIsOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            ➕ Add Candidate
          </button>
        </div>

        <KanbanBoard key={refreshKey} />
        <AddCandidateForm isOpen={isOpen} setIsOpen={setIsOpen} refresh={refreshBoard} />
      </div>
    </div>
  );
}
