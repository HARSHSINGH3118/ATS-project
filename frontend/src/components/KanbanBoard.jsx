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
      if (!res.ok) throw new Error("Failed to fetch candidates");
      const data = await res.json();
      setCandidates(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setCandidates([]);
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

  const openResume = (url) => {
    setResumeUrl(url);
    setIsOpen(true);
  };

  return (
    <>
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <input type="text" placeholder="Search by name/role..." value={search} onChange={(e) => setSearch(e.target.value)} className="border p-2 rounded w-60" />
        <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="border p-2 rounded">
          <option value="">All Roles</option>
          <option value="Frontend Developer">Frontend Developer</option>
          <option value="Backend Developer">Backend Developer</option>
          <option value="Designer">Designer</option>
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="border p-2 rounded">
          <option value="">All Status</option>
          {stages.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <button onClick={() => setIsFormOpen(true)} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">+ Add Candidate</button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-4 gap-4 p-4">
          {stages.map((stage) => (
            <Droppable key={stage} droppableId={stage}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 min-h-[400px]">
                  <h2 className="font-bold text-lg mb-3">{stage}</h2>
                  {grouped[stage]?.map((candidate, index) => (
                    <Draggable key={candidate._id} draggableId={candidate._id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white dark:bg-gray-800 shadow p-3 mb-3 rounded cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900"
                          onClick={() => openResume(candidate.resumeLink)}
                        >
                          <p className="font-semibold">{candidate.name}</p>
                          <p className="text-sm text-gray-500">{candidate.role}</p>
                          <p className="text-xs text-gray-400">{candidate.experience} yrs exp</p>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      <ResumeViewer isOpen={isOpen} setIsOpen={setIsOpen} url={resumeUrl} />
      <AddCandidateForm isOpen={isFormOpen} setIsOpen={setIsFormOpen} refresh={fetchCandidates} />
    </>
  );
}
