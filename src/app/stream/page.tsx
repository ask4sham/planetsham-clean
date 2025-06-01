"use client";

import { useEffect, useState } from "react";
import { PostCard } from "@/components/PostCard"; // ✅ Must match the named export

type Post = {
  id: number;
  type: "text" | "image" | "video" | "poll" | "link";
  content: string;
  createdAt: string;
};

export default function StreamPage() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch("/api/stream")
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch(() => setPosts([]));
  }, []);

  return (
    <main className="p-6 max-w-4xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-6">🌊 The Stream</h1>
      <p className="mb-4 text-zinc-400">AI-generated and user-curated feed</p>

      {posts.length === 0 ? (
        <p className="text-zinc-500">Loading stream...</p>
      ) : (
        <section className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </section>
      )}
    </main>
  );
}
