"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Post = {
  id: string;
  content: string;
  boost_count: number;
};

export default function LeaderboardPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadLeaderboard() {
    const { data: boosts } = await supabase.from("boosts").select("post_id");
    if (!boosts) return;

    const countMap: Record<string, number> = {};
    for (const boost of boosts) {
      countMap[boost.post_id] = (countMap[boost.post_id] || 0) + 1;
    }

    const postIds = Object.keys(countMap);
    const { data: fetchedPosts } = await supabase
      .from("posts")
      .select("id, content")
      .in("id", postIds);

    const merged = fetchedPosts
      ?.map((post) => ({
        ...post,
        boost_count: countMap[post.id],
      }))
      .sort((a, b) => b.boost_count - a.boost_count);

    setPosts(merged || []);
    setLoading(false);
  }

  useEffect(() => {
    loadLeaderboard(); // initial load

    const sub = supabase
      .channel("realtime boosts")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "boosts" },
        () => {
          console.log("⚡ New boost inserted");
          loadLeaderboard();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(sub);
    };
  }, []);

  return (
    <main className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-4">🔥 Boost Leaderboard</h1>
      {loading ? (
        <p>Loading...</p>
      ) : posts.length ? (
        <ul className="space-y-4">
          {posts.map((post) => (
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
