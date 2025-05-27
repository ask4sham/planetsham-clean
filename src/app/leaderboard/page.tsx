// src/app/leaderboard/page.tsx
import { supabase } from "@/lib/supabaseClient";

export default async function LeaderboardPage() {
  const { data: boosts, error } = await supabase
    .from("boosts")
    .select("post_id");

  if (error || !boosts) {
    return <p className="text-red-500">Failed to load leaderboard.</p>;
  }

  const countMap: Record<string, number> = {};
  for (const boost of boosts) {
    countMap[boost.post_id] = (countMap[boost.post_id] || 0) + 1;
  }

  const postIds = Object.keys(countMap);

  const { data: posts } = await supabase
    .from("posts")
    .select("id, content")
    .in("id", postIds);

  const merged = posts?.map((post) => ({
    ...post,
    boost_count: countMap[post.id],
  })).sort((a, b) => b.boost_count - a.boost_count);

  return (
    <main className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-4">🔥 Boost Leaderboard</h1>
      {merged?.length ? (
        <ul className="space-y-4">
          {merged.map((post) => (
            <li key={post.id} className="p-4 bg-zinc-800 rounded-lg shadow-md">
              <p className="text-lg">{post.content}</p>
              <p className="text-green-400">Boosts: {post.boost_count}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-zinc-400">No boosts yet.</p>
      )}
    </main>
  );
}
