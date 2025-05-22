// src/app/page.tsx
"use client";

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Post = {
  content: string;
  scheduledAt: string;
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "🌅 Good morning";
  if (hour < 18) return "🌞 Good afternoon";
  return "🌙 Good evening";
}

export const metadata: Metadata = {
  title: "PlanetSham – AI-Powered Insights & Blog",
  description: "Explore PlanetSham: your AI-powered hub for intelligent blog posts, real-time analytics, and curated content.",
};

export default function Home() {
  const greeting = getGreeting();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch("/api/posts/published")
      .then((res) => res.json())
      .then((data) => setPosts(data));
  }, []);

  const latestPosts = posts.slice(0, 3);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start text-center sm:text-left">
<h1 className="text-4xl font-bold">{greeting}, welcome to PlanetSham 🚀</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
          Your AI-powered hub for intelligent insights, real-time blogging, and analytics that matter.
        </p>

        <div className="flex gap-4 flex-wrap justify-center sm:justify-start mt-6">
          <Link href="/blog" className="rounded-full bg-blue-600 text-white px-5 py-3 text-sm sm:text-base hover:bg-blue-700">
            📝 Explore Blog
          </Link>
          <Link href="/dashboard" className="rounded-full bg-green-600 text-white px-5 py-3 text-sm sm:text-base hover:bg-green-700">
            📊 Dashboard
          </Link>
          <Link href="https://beehiiv.com" target="_blank" rel="noopener noreferrer" className="rounded-full bg-yellow-500 text-white px-5 py-3 text-sm sm:text-base hover:bg-yellow-600">
            📬 Newsletter
          </Link>
        </div>

        <div className="mt-10 bg-white dark:bg-gray-900 shadow-md rounded p-6 w-full max-w-2xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-2">🧠 Latest Blog Posts</h2>
          {latestPosts.length === 0 ? (
            <p className="text-sm text-gray-500">No posts available yet.</p>
          ) : (
            <ul className="space-y-4">
              {latestPosts.map((post, idx) => (
                <li key={idx} className="text-sm text-gray-700 dark:text-gray-300">
                  <p>{post.content.replace(/^🤖 /, "")}</p>
                  <p className="text-xs text-gray-500">Published: {new Date(post.scheduledAt).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          )}
          <Link href="/blog" className="text-blue-600 text-sm mt-2 inline-block hover:underline">
            View all posts →
          </Link>
        </div>
      </main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center mt-12 text-sm">
        <a href="https://nextjs.org/learn" className="hover:underline hover:underline-offset-4" target="_blank" rel="noopener noreferrer">📘 Learn</a>
        <a href="https://vercel.com/templates?framework=next.js" className="hover:underline hover:underline-offset-4" target="_blank" rel="noopener noreferrer">🧪 Examples</a>
        <a href="https://nextjs.org" className="hover:underline hover:underline-offset-4" target="_blank" rel="noopener noreferrer">🌐 Next.js</a>
      </footer>
    </div>
  );
}
