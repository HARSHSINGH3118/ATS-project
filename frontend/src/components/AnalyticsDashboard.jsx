import React, { useEffect, useState, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import domtoimage from "dom-to-image-more";
import jsPDF from "jspdf";

const API_URL = "http://localhost:5000/api/candidates/analytics/data";

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const reportRef = useRef(null);

  const fetchAnalytics = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch analytics");
      const data = await res.json();
      setAnalytics(data);
    } catch (err) {
      console.error("Analytics fetch error:", err);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (!analytics) return <p className="text-center">Loading analytics...</p>;

  const roleData = Object.entries(analytics.roleCount).map(([role, count]) => ({ role, count }));
  const stageData = Object.entries(analytics.stageCount).map(([stage, count]) => ({ stage, count }));
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const handleExportPNG = () => {
    domtoimage.toPng(reportRef.current).then((dataUrl) => {
      const link = document.createElement("a");
      link.download = "ATS-Analytics.png";
      link.href = dataUrl;
      link.click();
    });
  };

  const handleExportPDF = () => {
    domtoimage.toPng(reportRef.current).then((dataUrl) => {
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (pdfWidth * reportRef.current.offsetHeight) / reportRef.current.offsetWidth;
      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("ATS-Analytics.pdf");
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">📊 Analytics Dashboard</h1>
        <div className="space-x-2">
          <button onClick={handleExportPNG} className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Export PNG</button>
          <button onClick={handleExportPDF} className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700">Export PDF</button>
        </div>
      </div>

      <div ref={reportRef} className="space-y-6 bg-white dark:bg-gray-900 p-4 rounded">
        <div className="bg-white dark:bg-gray-800 shadow rounded p-6 text-center">
          <h2 className="text-lg font-semibold">Average Candidate Experience</h2>
          <p className="text-3xl font-bold text-blue-600 dark:text-yellow-400">
            {analytics.averageExperience} years
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded p-6">
          <h2 className="text-lg font-semibold mb-4">Pipeline Stage Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={stageData} dataKey="count" nameKey="stage" cx="50%" cy="50%" outerRadius={100} label>
                {stageData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded p-6">
          <h2 className="text-lg font-semibold mb-4">Role Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={roleData}>
              <XAxis dataKey="role" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
