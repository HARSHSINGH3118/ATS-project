import React, { useState } from "react";
import { Dialog } from "@headlessui/react";

const API_URL = "http://localhost:5000/api/candidates";

export default function AddCandidateForm({ isOpen, setIsOpen, refresh }) {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    experience: "",
    email: "",
    phone: "",
    notes: "",
    status: "Applied", // default stage
  });
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Fix: ensure "experience" is stored as Number, not String
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "experience" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      if (!token) throw new Error("No token found. Please login again.");

      // 1. Create candidate
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to create candidate");
      const newCandidate = await res.json();

      // 2. Upload resume if provided
      if (resume) {
        const uploadData = new FormData();
        uploadData.append("resume", resume); // must match backend field

        const resumeRes = await fetch(
          `${API_URL}/${newCandidate._id}/uploadResume`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: uploadData,
          }
        );

        if (!resumeRes.ok) throw new Error("Resume upload failed");
      }

      // 3. Refresh UI + reset
      refresh();
      setIsOpen(false);
      setFormData({
        name: "",
        role: "",
        experience: "",
        email: "",
        phone: "",
        notes: "",
        status: "Applied",
      });
      setResume(null);
    } catch (err) {
      console.error("Error adding candidate:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
          <Dialog.Title className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100">
            Add Candidate
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" required />
            <input name="role" placeholder="Role" value={formData.role} onChange={handleChange} className="w-full p-2 border rounded" required />
            <input type="number" name="experience" placeholder="Years of Experience" value={formData.experience} onChange={handleChange} className="w-full p-2 border rounded" required />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded" />
            <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className="w-full p-2 border rounded" />
            <textarea name="notes" placeholder="Notes" value={formData.notes} onChange={handleChange} className="w-full p-2 border rounded" />

            {/* Resume Upload */}
            <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResume(e.target.files[0])} className="w-full p-2 border rounded" />

            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded">
              {loading ? "Adding..." : "Add Candidate"}
            </button>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
