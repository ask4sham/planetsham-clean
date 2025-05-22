"use client";

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

export default function HomeClient() {
  const greeting = getGreeting();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch("/api/posts/published")
      .then((res) => res.json())
      .then((data) => setPosts(data));
  }, []);

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{greeting}, welcome to PlanetSham</h1>

      <section className="space-y-4">
        {posts.length === 0 ? (
          <p>No published posts yet.</p>
        ) : (
          posts.map((post, index) => (
            <div
              key={index}
              className="p-4 rounded-xl shadow-md border bg-white dark:bg-zinc-900"
            >
              <p className="text-lg">{post.content}</p>
              <p className="text-sm text-zinc-500 mt-2">
                Scheduled: {new Date(post.scheduledAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </section>
    </main>
  );
}
