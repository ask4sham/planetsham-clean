"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";

type AnalyticsData = {
  totalPosts: number;
  tagsCount: Record<string, number>;
  monthlyCount: Record<string, number>;
};

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    fetch("/api/analytics")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return <p className="p-4">Loading analytics...</p>;

  const monthlyData = Object.entries(data.monthlyCount).map(([month, count]) => ({
    month,
    count,
  }));

  const tagData = Object.entries(data.tagsCount).map(([tag, count]) => ({
    name: tag,
    value: count,
  }));

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">📊 Post Analytics</h1>

      {/* ✅ Summary Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center bg-gray-50 rounded shadow p-4">
        <div>
          <p className="text-sm text-gray-500">Total Posts</p>
          <p className="text-xl font-semibold">{data.totalPosts}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Tags</p>
          <p className="text-xl font-semibold">{Object.keys(data.tagsCount).length}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Active Months</p>
          <p className="text-xl font-semibold">{Object.keys(data.monthlyCount).length}</p>
        </div>
      </div>

      <div className="h-64">
        <h2 className="text-xl font-semibold mb-2">Posts by Month</h2>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="h-64">
        <h2 className="text-xl font-semibold mb-2">Posts by Tag</h2>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={tagData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {tagData.map((_, i) => (
                <Cell key={i} fill={`hsl(${(i * 50) % 360}, 70%, 60%)`} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
