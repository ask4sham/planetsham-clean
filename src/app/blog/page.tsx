"use client";

import { useState, useEffect } from "react";

type Post = {
  content: string;
  scheduledAt: string;
};

const starterPosts: Post[] = [
  {
    content: "AI is becoming part of daily life – from scheduling to writing content.",
    scheduledAt: "2025-05-21T09:00",
  },
  {
    content: "Search is changing. People ask questions instead of typing keywords.",
    scheduledAt: "2025-05-22T10:30",
  },
  {
    content: "🤖 AI-generated music is becoming more popular than ever.",
    scheduledAt: "2025-05-23T15:00",
  },
];

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>(starterPosts);
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    posts.forEach((_, index) => {
      fetch(`/api/posts/view/${index}`, { method: "POST" });
    });
  }, []);

  const handleAddPost = () => {
    if (newPost.trim()) {
      const newEntry: Post = {
        content: newPost,
        scheduledAt: new Date().toISOString().slice(0, 16),
      };
      setPosts([newEntry, ...posts]);
      setNewPost("");
    }
  };

  const handleGenerateAI = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: "Write a short blog post about the latest in AI" }),
      });

      const data = await res.json();
      if (data?.reply) {
        const newAIPost: Post = {
          content: `🤖 ${data.reply}`,
          scheduledAt: new Date().toISOString().slice(0, 16),
        };
        setPosts((prev) => [newAIPost, ...prev]);
      }
    } catch (err) {
      console.error("Error generating AI post", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (index: number, newDate: string) => {
    const updated = [...posts];
    updated[index].scheduledAt = newDate;
    setPosts(updated);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">PlanetSham Blog</h1>

      <div className="flex gap-2 mb-4">
        <input
          className="flex-1 border border-gray-300 rounded px-3 py-2"
          placeholder="Write a new post..."
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />
        <button
          onClick={handleAddPost}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Add
        </button>
        <button
          onClick={handleGenerateAI}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Thinking..." : "Ask AI"}
        </button>
      </div>

      <ul className="space-y-4">
        {posts.map((post, index) => {
          const content = post?.content ?? "";
          const isAI = content.startsWith("🤖");

          return (
            <li
              key={index}
              className={`p-4 rounded shadow-sm border ${isAI ? "bg-blue-50 border-blue-300" : "bg-white"}`}
            >
              {isAI && (
                <span className="text-xs text-blue-500 font-semibold block mb-1">
                  AI-Generated
                </span>
              )}
              <p className="mb-2">{content.replace(/^🤖/, "")}</p>
              <label className="block text-sm text-gray-600 mb-1">
                📅 Scheduled At:
              </label>
              <input
                type="datetime-local"
                value={post.scheduledAt}
                onChange={(e) => handleDateChange(index, e.target.value)}
                className="border px-2 py-1 rounded w-full"
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
