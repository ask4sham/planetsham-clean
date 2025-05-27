// src/app/leaderboard/page.tsx
import { supabase } from "@/lib/supabaseClient";

type BoostCount = {
  post_id: string;
  boost_count: number;
};

export default async function LeaderboardPage() {
  const { data, error } = await supabase
    .from("boosts")
    .select("post_id", { count: "exact", head: false });

  if (error) {
    console.error(error.message);
    return <p className="text-red-500">Failed to load leaderboard.</p>;
  }

  const counts = data?.reduce<Record<string, number>>((acc, entry) => {
    const { post_id } = entry;
    acc[post_id] = (acc[post_id] || 0) + 1;
    return acc;
  }, {}) || {};

  const sorted = Object.entries(counts).sort(([, a], [, b]) => b - a);

  return (
    <main className="p-6 text-white max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">🔥 Boost Leaderboard</h1>
      {sorted.length === 0 ? (
        <p className="text-zinc-400">No boosts yet.</p>
      ) : (
        <ul className="space-y-4">
          {sorted.map(([postId, count]) => (
            <li key={postId} className="p-4 bg-zinc-800 rounded-xl shadow">
              <p className="text-sm text-zinc-300">Post ID: {postId}</p>
              <p className="text-green-400 font-semibold">Boosts: {count}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
