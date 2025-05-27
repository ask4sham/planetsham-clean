// src/app/leaderboard/page.tsx
import { supabase } from "@/lib/supabaseClient";

export default async function LeaderboardPage() {
  // Step 1: Get all boosts
  const { data: boosts, error: boostError } = await supabase
    .from("boosts")
    .select("post_id");

  if (boostError || !boosts || boosts.length === 0) {
    return <p className="text-zinc-400">🔥 No boosts yet.</p>;
  }

  // Step 2: Count boosts by post_id
  const countMap: Record<string, number> = {};
  for (const boost of boosts) {
    countMap[boost.post_id] = (countMap[boost.post_id] || 0) + 1;
  }

  const postIds = Object.keys(countMap);

  // Step 3: Load posts that match postIds (adjust this if your posts table doesn't have "content")
  const { data: posts, error: postError } = await supabase
    .from("posts")
    .select("id, content"); // Change this to match actual fields like "title" or "text" if needed

  if (postError || !posts) {
    return <p className="text-red-500">Failed to load post details.</p>;
  }

  // Step 4: Merge and sort
  const merged = posts
    .filter((post) => postIds.includes(post.id))
    .map((post) => ({
      ...post,
      boost_count: countMap[post.id],
    }))
    .sort((a, b) => b.boost_count - a.boost_count);

  return (
    <main className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-4">🔥 Boost Leaderboard</h1>
      {merged.length > 0 ? (
        <ul className="space-y-4">
          {merged.map((post) => (
            <li key={post.id} className="p-4 bg-zinc-800 rounded-lg shadow-md">
              <p className="text-lg">{post.content ?? "Untitled post"}</p>
              <p className="text-green-400">Boosts: {post.boost_count}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-zinc-400">🔥 No boosts yet.</p>
      )}
    </main>
  );
}
