"use client";

import { useEffect, useState } from "react";

type LeaderboardItem = {
  content: string;
  boost_count: number;
};

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);

  useEffect(() => {
    fetch("/api/boost/leaderboard")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const formatted = data.map((row) => ({
            content: row.posts?.content || "Unknown post",
            boost_count: row.boost_count || 0,
          }));
          setLeaderboard(formatted);
        }
      });
  }, []);

  return (
    <main className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-emerald-400 mb-4">🔥 Boost Leaderboard</h1>
      <p className="text-zinc-500 mb-6">See which posts are getting the most love.</p>

      {leaderboard.length === 0 ? (
        <p className="text-center text-zinc-400">No boosts yet...</p>
      ) : (
        <ul className="space-y-3 text-sm text-zinc-300">
          {leaderboard.map((item, i) => (
            <li key={i} className="border-b border-zinc-700 pb-2">
              <strong>#{i + 1}</strong> – {item.content}{" "}
              <span className="text-emerald-300">({item.boost_count} boosts)</span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
