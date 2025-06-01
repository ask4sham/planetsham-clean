"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import AIContextBlock from "@/components/AIContextBlock";

type Post = {
  content: string;
  publishedAt: string;
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
      .then((data) => setPosts(data));
  }, []);

  return (
    <main className="p-6 max-w-3xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-4">{greeting}, welcome to PlanetSham 🚀</h1>
      <p className="mb-6 text-zinc-400">Your AI-powered hub for clarity in a chaotic world.</p>

      {/* 👇 AI Context Engine block */}
      <AIContextBlock />

      {/* 👇 AI-Published Posts */}
      <h2 className="text-xl font-semibold mt-10 mb-4">📝 Latest AI Posts</h2>
      {posts.length === 0 ? (
        <p className="text-zinc-400">No posts yet. Check back soon!</p>
      ) : (
        posts.map((post, index) => (
          <div
            key={index}
            className="bg-zinc-900 p-4 mb-4 rounded-xl border border-zinc-800"
          >
            <p className="text-sm">{post.content}</p>
            <p className="text-xs text-zinc-500 mt-2">
              Published: {new Date(post.publishedAt).toLocaleString()}
            </p>
          </div>
        ))
      )}

      {/* 👇 Navigation Links */}
      <div className="mt-10 flex gap-4">
        <Link
          href="/stream"
          className="bg-blue-600 px-4 py-2 rounded text-white text-sm"
        >
          🌊 Go to Stream
        </Link>
        <Link
          href="/dashboard"
          className="bg-green-600 px-4 py-2 rounded text-white text-sm"
        >
          ✍️ Create Content
        </Link>
      </div>
    </main>
  );
}
