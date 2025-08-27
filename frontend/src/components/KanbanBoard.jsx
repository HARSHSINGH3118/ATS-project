import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ResumeViewer from "./ResumeViewer";
import AddCandidateForm from "./AddCandidateForm";

const API_URL = "http://localhost:5000/api/candidates";

export default function KanbanBoard() {
  const [candidates, setCandidates] = useState([]);
  const [resumeUrl, setResumeUrl] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Fetch candidates
  const fetchCandidates = async () => {
    const token = localStorage.getItem("token");
    let query = [];
    if (filterRole) query.push(`role=${filterRole}`);
    if (filterStatus) query.push(`status=${filterStatus}`);
    const queryString = query.length ? `?${query.join("&")}` : "";
    try {
      const res = await fetch(`${API_URL}${queryString}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCandidates(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const updateStatus = async (id, newStatus) => {
    const token = localStorage.getItem("token");
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchCandidates();
  };

  useEffect(() => {
    fetchCandidates();
  }, [filterRole, filterStatus]);

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId !== destination.droppableId) {
      updateStatus(draggableId, destination.droppableId);
    }
  };

  const stages = ["Applied", "Interview", "Offer", "Rejected"];

  const filteredCandidates = candidates.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.role.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = stages.reduce((acc, stage) => {
    acc[stage] = filteredCandidates.filter((c) => c.status === stage);
    return acc;
  }, {});

  // Stage colors for cards
  const stageColors = {
    Applied:
      "bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600",
    Interview:
      "bg-blue-100 dark:bg-blue-800 border border-blue-300 dark:border-blue-600",
    Offer:
      "bg-green-100 dark:bg-green-800 border border-green-300 dark:border-green-600",
    Rejected:
      "bg-red-100 dark:bg-red-800 border border-red-300 dark:border-red-600",
  };

  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <input
          type="text"
          placeholder="Search by name/role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-60 shadow-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        />
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="border p-2 rounded shadow-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        >
          <option value="">All Roles</option>
          <option value="Frontend Developer">Frontend Developer</option>
          <option value="Backend Developer">Backend Developer</option>
          <option value="Designer">Designer</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border p-2 rounded shadow-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        >
          <option value="">All Status</option>
          {stages.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          onClick={() => setIsFormOpen(true)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 shadow"
        >
          + Add Candidate
        </button>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stages.map((stage) => (
            <Droppable key={stage} droppableId={stage}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`relative flex-1 min-h-[500px] p-4 rounded-xl shadow-md backdrop-blur-md
                    bg-white/60 dark:bg-gray-900/60
                    ${snapshot.isDraggingOver ? "ring-2 ring-blue-400" : ""}
                  `}
                >
                  {/* Column Header */}
                  <h2 className="font-semibold text-lg mb-4 text-gray-900 dark:text-gray-100 flex justify-between">
                    {stage}
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {grouped[stage]?.length || 0}
                    </span>
                  </h2>

                  {/* Cards */}
                  {grouped[stage]?.map((candidate, index) => (
                    <Draggable
                      key={candidate._id}
                      draggableId={candidate._id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`relative p-4 mb-3 rounded-lg shadow-md cursor-pointer
                            ${stageColors[stage]}
                            text-gray-900 dark:text-white
                            ${snapshot.isDragging ? "shadow-2xl z-50" : ""}
                          `}
                          style={{
                            ...provided.draggableProps.style,
                            // Always merge rotation, not overwrite
                            transform: snapshot.isDragging
                              ? `${provided.draggableProps.style?.transform ?? ""} rotate(2deg)`
                              : provided.draggableProps.style?.transform,
                            zIndex: snapshot.isDragging ? 9999 : "auto",
                          }}
                          onClick={() => {
                            setResumeUrl(candidate.resumeLink);
                            setIsOpen(true);
                          }}
                        >
                          <p className="font-semibold">{candidate.name}</p>
                          <p className="text-sm opacity-90">{candidate.role}</p>
                          <p className="text-xs opacity-75">
                            {candidate.experience} yrs exp
                          </p>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {/* Droppable Placeholder */}
                  <div className="pointer-events-none">{provided.placeholder}</div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {/* Modals */}
      <ResumeViewer isOpen={isOpen} setIsOpen={setIsOpen} url={resumeUrl} />
      <AddCandidateForm
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
        refresh={fetchCandidates}
      />
    </>
  );
}
