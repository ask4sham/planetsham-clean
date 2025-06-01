"use client";

import { useState, useEffect } from "react";
import { PostCard } from "@/components/PostCard";

type Post = {
  id: string;
  content: string;
  scheduledAt: string;
  tags?: string[];
  model_used?: string;
};

const starterPosts: Post[] = [
  {
    id: "8019fcf1-21d7-42d4-b5b8-0eabbbb59f99",
    content: "AI is becoming part of daily life – from scheduling to writing content.",
    scheduledAt: "2025-05-21T09:00",
    tags: ["AI", "Productivity"],
    model_used: "GPT-4",
  },
  {
    id: "e9a37150-9237-458a-9fbb-7b69885e77be",
    content: "Search is changing. People ask questions instead of typing keywords.",
    scheduledAt: "2025-05-22T10:30",
    tags: ["Search", "AI"],
  },
  {
    id: "fbd10531-d13d-4cec-b761-78fbda4bdcb8",
    content: "🤖 AI-generated music is becoming more popular than ever.",
    scheduledAt: "2025-05-23T15:00",
    tags: ["Music", "Generative AI"],
    model_used: "Mistral",
  },
];

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>(starterPosts);
  const [newPost, setNewPost] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    posts.forEach((_, index) => {
      fetch(`/api/posts/view/${index}`, { method: "POST" });
    });
  }, [posts]);

  const handleAddPost = () => {
    if (newPost.trim()) {
      const tags = tagInput.split(",").map((tag) => tag.trim()).filter(Boolean);
      const newEntry: Post = {
        id: crypto.randomUUID(),
        content: newPost,
        scheduledAt: new Date().toISOString().slice(0, 16),
        tags,
      };
      setPosts([newEntry, ...posts]);
      setNewPost("");
      setTagInput("");
    }
  };

  const handleGenerateAI = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: "Write a short blog post about the latest in AI",
          model: "gpt-4",
        }),
      });

      const data = await res.json();
      if (data?.output) {
        const tags = tagInput.split(",").map((tag) => tag.trim()).filter(Boolean);
        const newAIPost: Post = {
          id: crypto.randomUUID(),
          content: `🤖 ${data.output}`,
          scheduledAt: new Date().toISOString().slice(0, 16),
          tags,
          model_used: "GPT-4",
        };
        setPosts((prev) => [newAIPost, ...prev]);
        setTagInput("");
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
        <input
          className="border border-gray-300 rounded px-3 py-2"
          placeholder="Add tags (comma separated)..."
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
        />
        <div className="flex gap-2">
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
      </div>

      <ul className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </ul>
    </div>
  );
}
