import React, { useEffect, useState, useRef } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from "recharts";
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

  // Transform data
  const roleData = Object.entries(analytics.roleCount)
    .map(([role, count]) => ({ role, count }))
    .sort((a, b) => b.count - a.count);

  const stageData = Object.entries(analytics.stageCount).map(([stage, count]) => ({
    stage,
    count,
  }));

  const COLORS = {
    Applied: "#9CA3AF", // gray
    Interview: "#3B82F6", // blue
    Offer: "#10B981", // green
    Rejected: "#EF4444", // red
  };

  // Experience distribution ranges
  const expRanges = [
    { range: "0-2", count: analytics.candidates?.filter(c => c.experience <= 2).length || 0 },
    { range: "3-5", count: analytics.candidates?.filter(c => c.experience >= 3 && c.experience <= 5).length || 0 },
    { range: "6-10", count: analytics.candidates?.filter(c => c.experience >= 6 && c.experience <= 10).length || 0 },
    { range: "10+", count: analytics.candidates?.filter(c => c.experience > 10).length || 0 },
  ];

  // Mock timeline data (if backend doesn’t yet provide)
  const timelineData = [
    { month: "Jan", applications: 5 },
    { month: "Feb", applications: 12 },
    { month: "Mar", applications: 9 },
    { month: "Apr", applications: 15 },
  ];

  // Export functions
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
      const pdfHeight =
        (pdfWidth * reportRef.current.offsetHeight) / reportRef.current.offsetWidth;
      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("ATS-Analytics.pdf");
    });
  };

  const handleExportCSV = () => {
    const rows = [
      ["Role", "Count"],
      ...roleData.map((r) => [r.role, r.count]),
    ];
    const csvContent =
      "data:text/csv;charset=utf-8," +
      rows.map((r) => r.join(",")).join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "ATS-Analytics.csv";
    link.click();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Analytics Dashboard
        </h1>
        <div className="space-x-2">
          <button
            onClick={handleExportPNG}
            className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Export PNG
          </button>
          <button
            onClick={handleExportPDF}
            className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Export PDF
          </button>
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Report Container */}
      <div
        ref={reportRef}
        className="space-y-6 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg"
      >
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-center">
            <h3 className="text-sm text-gray-500 dark:text-gray-400">Total Candidates</h3>
            <p className="text-2xl font-bold">{analytics.candidates?.length || 0}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-center">
            <h3 className="text-sm text-gray-500 dark:text-gray-400">Avg. Experience</h3>
            <p className="text-2xl font-bold text-blue-600 dark:text-yellow-400">
              {analytics.averageExperience} yrs
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-center">
            <h3 className="text-sm text-gray-500 dark:text-gray-400">Offers</h3>
            <p className="text-2xl font-bold text-green-600">
              {analytics.stageCount.Offer}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-center">
            <h3 className="text-sm text-gray-500 dark:text-gray-400">Rejected</h3>
            <p className="text-2xl font-bold text-red-500">
              {analytics.stageCount.Rejected}
            </p>
          </div>
        </div>

        {/* Stage Distribution */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Pipeline Stage Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stageData}
                dataKey="count"
                nameKey="stage"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {stageData.map((entry, i) => (
                  <Cell key={i} fill={COLORS[entry.stage]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Role Distribution */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Role Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={roleData}>
              <XAxis dataKey="role" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Applications Over Time */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Applications Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timelineData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="applications" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Experience Distribution */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Experience Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={expRanges}>
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
