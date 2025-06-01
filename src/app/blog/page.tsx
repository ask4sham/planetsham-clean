"use client";

import { useState, useEffect } from "react";
import { PostCard } from "@/components/PostCard";

export type Post = {
  id: string;
  content: string;
  scheduledAt: string;
  tags?: string[];
  model_used?: string;
  type?: "text" | "image" | "video" | "poll" | "link";
};

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    posts.forEach((_, index) => {
      fetch(`/api/posts/view/${index}`, { method: "POST" });
    });
  }, [posts]);

  const handleGenerateAI = async () => {
    if (!newPost.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: newPost.trim(),
          model: "gpt-4",
        }),
      });

      const data = await res.json();
      if (data?.output) {
        const newAIPost: Post = {
          id: crypto.randomUUID(),
          content: `🤖 ${data.output}`,
          scheduledAt: new Date().toISOString().slice(0, 16),
          model_used: "GPT-4",
          type: "text",
        };
        setPosts((prev) => [newAIPost, ...prev]);
        setNewPost("");
      }
    } catch (err) {
      console.error("Error generating AI post", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (content: string, scheduledAt: string) => {
    try {
      const res = await fetch("/api/posts/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, scheduledAt, type: "scheduled" }),
      });

      if (res.ok) {
        setPosts((prev) =>
          prev.filter((p) => !(p.content === content && p.scheduledAt === scheduledAt))
        );
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">PlanetSham Blog</h1>

      <div className="flex flex-col gap-2 mb-4">
        <input
          className="border border-gray-300 rounded px-3 py-2"
          placeholder="Write a new post..."
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />
        <div className="flex gap-2">
          <button
            onClick={handleGenerateAI}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Thinking..." : "Ask Sham"}
          </button>
        </div>
      </div>

      <ul className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </ul>
    </div>
  );
}
