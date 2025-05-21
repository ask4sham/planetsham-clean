"use client";

import { useState, useEffect } from "react";
import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";

type Post = {
  content: string;
  scheduledAt?: string;
  tags?: string[];
};

export default function DashboardPage() {
  const [view, setView] = useState<"published" | "scheduled">("published");
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedTag, setSelectedTag] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`/api/posts/${view}`)
      .then((res) => res.json())
      .then((data: Post[]) => setPosts(data));
  }, [view]);

  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags || [])));

  const filteredPosts = posts.filter((post) => {
    const tagMatch = selectedTag === "All" || post.tags?.includes(selectedTag);
    const textMatch = post.content.toLowerCase().includes(search.toLowerCase());
    return tagMatch && textMatch;
  });

  const handleEdit = async (index: number) => {
    const post = posts[index];
    const newContent = prompt("Edit post content:", post.content) ?? "";
    const newDate = prompt("Reschedule date (YYYY-MM-DDTHH:mm):", post.scheduledAt || "") ?? "";
    const newTagsRaw = prompt("Enter tags (comma-separated):", post.tags?.join(", ") || "") ?? "";

    if (newContent && newDate) {
      const tags = newTagsRaw.split(",").map((t) => t.trim()).filter(Boolean);
      await fetch("/api/posts/scheduled/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ index, newContent, newDate, tags }),
      });
      window.location.reload();
    }
  };

  const handleDelete = async (index: number) => {
    if (confirm("Are you sure you want to delete this post?")) {
      await fetch("/api/posts/scheduled/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ index }),
      });
      window.location.reload();
    }
  };

  const handleManualPublish = async () => {
    const res = await fetch("/api/publish");
    const data = await res.json();
    alert(`📤 Published ${data.published.length} post(s) manually.`);
    window.location.reload();
  };

  return (
    <div className="p-4">
      {/* View Toggle + Actions */}
      <div className="flex flex-wrap gap-2 items-center mb-4">
        <button
          onClick={() => setView("published")}
          className={`px-4 py-2 rounded ${view === "published" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          📬 Published
        </button>
        <button
          onClick={() => setView("scheduled")}
          className={`px-4 py-2 rounded ${view === "scheduled" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          🕒 Scheduled
        </button>
        <button
          onClick={handleManualPublish}
          className="px-4 py-2 bg-green-600 text-white rounded ml-auto"
        >
          📤 Publish Now
        </button>
        <a
          href="/api/export"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-yellow-500 text-white rounded"
        >
          📥 Download CSV
        </a>
      </div>

      {/* Tag Filter */}
      {allTags.length > 0 && (
        <div className="flex gap-2 mb-4 mt-2 flex-wrap text-sm">
          <button
            onClick={() => setSelectedTag("All")}
            className={`px-2 py-1 rounded border ${selectedTag === "All" ? "bg-black text-white" : "bg-gray-100"}`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-2 py-1 rounded border ${selectedTag === tag ? "bg-black text-white" : "bg-gray-100"}`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Search */}
      <input
        type="text"
        placeholder="🔍 Search content..."
        className="w-full p-2 mb-4 border rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Posts */}
      <ul className="space-y-2">
        {filteredPosts.map((post, idx) => (
          <li key={idx} className="bg-white border rounded p-3 shadow-sm space-y-1">
            <div
              className="prose"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(marked(post.content)),
              }}
            />
            <p className="text-xs text-gray-500">
              {post.scheduledAt
                ? `Scheduled: ${new Date(post.scheduledAt).toLocaleString()}`
                : "Published"}
            </p>
            {post.tags?.length > 0 && (
              <p className="text-xs text-gray-400">Tags: {post.tags.join(", ")}</p>
            )}
            {view === "scheduled" && (
              <div className="flex gap-2 text-xs">
                <button onClick={() => handleEdit(idx)} className="text-blue-600 underline">
                  ✏️ Edit
                </button>
                <button onClick={() => handleDelete(idx)} className="text-red-600 underline">
                  ❌ Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
