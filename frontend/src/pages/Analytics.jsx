import React, { useEffect, useState } from "react";
import { fetchAnalytics } from "../services/api";

export default function Analytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetchAnalytics(token).then(setData).catch(console.error);
  }, []);

  if (!data) return <p className="p-6">Loading analytics...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Analytics Dashboard</h1>
      <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
