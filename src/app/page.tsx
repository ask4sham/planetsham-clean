// Force redeploy - cron activation

"use client";

import { useEffect, useState } from "react";
import { PostCard } from "../components/PostCard";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

type Post = {
  id: string;
  content: string;
  published_at?: string;
  boost_count: number;
  boosted_by_user: boolean;
};

type LeaderboardItem = {
  content: string;
  boost_count: number;
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "🌅 Good morning";
  if (hour < 18) return "🌞 Good afternoon";
  return "🌙 Good evening";
}

export default function Home() {
  const greeting = getGreeting();
  const [posts, setPosts] = useState<Post[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);

  useEffect(() => {
    const fetchPostsWithBoosts = async () => {
      const supabase = createClientComponentClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const userId = user?.id;

      const { data: posts } = await supabase
        .from("posts")
        .select("id, content, published_at, boosts(user_id)")
        .order("published_at", { ascending: false });

      const enrichedPosts = posts?.map((post) => {
        const boostCount = post.boosts?.length || 0;
        const boostedByUser = post.boosts?.some((b) => b.user_id === userId);
        return {
          ...post,
          boost_count: boostCount,
          boosted_by_user: boostedByUser,
        };
      });

      setPosts(enrichedPosts || []);
    };

    const fetchLeaderboard = async () => {
      const res = await fetch("/api/boost/leaderboard");
      const data = await res.json();

      if (Array.isArray(data)) {
        const formatted = data.map((row) => ({
          content: row.posts?.content || "Unknown post",
          boost_count: row.boost_count || 0,
        }));
        setLeaderboard(formatted);
      }
    };

    fetchPostsWithBoosts();
    fetchLeaderboard();
  }, []);

  const toggleBoost = async (postId: string, boosted: boolean) => {
    const endpoint = boosted ? "/api/unboost" : "/api/boost";
    await fetch(endpoint, {
      method: "POST",
      body: JSON.stringify({ postId }),
    });

    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              boost_count: boosted ? post.boost_count - 1 : post.boost_count + 1,
              boosted_by_user: !boosted,
            }
          : post
      )
    );
  };

  return (
    <main className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">{greeting}, welcome to PlanetSham 🌍</h1>
      <p className="text-zinc-500 mb-2">
        Where AI and culture collide.{" "}
        <a href="/leaderboard" className="text-emerald-400 hover:underline ml-1">
          View Leaderboard →
        </a>
      </p>

      {leaderboard.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-emerald-400">🔥 Top Boosted Posts</h2>
          <ul className="space-y-1 text-sm text-zinc-300">
            {leaderboard.map((item, i) => (
              <li key={i} className="border-b border-zinc-700 pb-2">
                <strong>#{i + 1}</strong> – {item.content}{" "}
                <span className="text-emerald-300">({item.boost_count} boosts)</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-4">
        {posts.length === 0 ? (
          <p className="text-center text-zinc-400">No published posts yet...</p>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              content={post.content}
              publishedAt={post.published_at}
              boostCount={post.boost_count}
              boostedByUser={post.boosted_by_user}
              onBoostToggle={() => toggleBoost(post.id, post.boosted_by_user)}
            />
          ))
        )}
      </div>
    </main>
  );
}
