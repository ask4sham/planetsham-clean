"use client";

import { useEffect, useState } from "react";
import PostCard from "@/components/PostCard";

type Post = {
  id?: string;
  content: string;
  published_at?: string;
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

  useEffect(() => {
    fetch("/api/posts/published")
      .then((res) => res.json())
      .then((data) => setPosts(data || []));
  }, []);

  return (
    <main className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">{greeting}, welcome to PlanetSham 🌍</h1>
      <p className="text-zinc-500 mb-6">Where AI and culture collide.</p>

      <div className="space-y-4">
        {posts.length === 0 ? (
          <p className="text-center text-zinc-400">No published posts yet...</p>
        ) : (
          posts.map((post, i) => (
            <PostCard key={post.id || i} content={post.content} publishedAt={post.published_at} />
          ))
        )}
      </div>
    </main>
  );
}
