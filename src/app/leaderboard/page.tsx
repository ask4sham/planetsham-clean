import { supabase } from "@/lib/supabaseClient";

type BoostEntry = {
  post_id: string;
  boost_count: number;
  content: string;
};

export default async function LeaderboardPage() {
  const { data: boostData, error } = await supabase
    .from("boosts")
    .select("post_id, posts(content)") // Removed .eq("posts.published", true)
    .order("post_id", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Leaderboard fetch failed:", error.message);
    return <p className="text-red-500">Failed to load leaderboard.</p>;
  }

  const leaderboard = boostData?.reduce<Record<string, BoostEntry>>((acc, row: any) => {
    const { post_id, posts } = row;
    if (!acc[post_id]) {
      acc[post_id] = { post_id, boost_count: 0, content: posts?.content || "" };
    }
    acc[post_id].boost_count++;
    return acc;
  }, {});

  const sorted = Object.values(leaderboard || {}).sort((a, b) => b.boost_count - a.boost_count);

  return (
    <main className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-4">🔥 Boost Leaderboard</h1>
      {sorted.length === 0 ? (
        <p className="text-zinc-400 flex flex-col items-center gap-2 mt-20">
          <span className="text-4xl">🔥</span>
          No boosts yet.
        </p>
      ) : (
        <ul className="space-y-4">
          {sorted.map(({ post_id, content, boost_count }) => (
            <li key={post_id} className="p-4 bg-zinc-800 rounded-lg shadow-md">
              <p className="text-lg">{content}</p>
              <p className="text-green-400">Boosts: {boost_count}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
