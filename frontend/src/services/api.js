export const fetchAnalytics = async (token) => {
  const res = await fetch("/api/candidates/analytics/data", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch analytics");
  return res.json();
};
