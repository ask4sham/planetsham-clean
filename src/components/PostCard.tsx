"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";

export type Post = {
  id: number;
  type: "text" | "image" | "video" | "poll" | "link";
  content: string;
  createdAt: string;
};

export function PostCard({ post }: { post: Post }) {
  const [isBoosted, setIsBoosted] = useState(false);

  const timeAgo = post.createdAt
    ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
    : "Just now";

  // ✅ Detect if post is boosted
  useEffect(() => {
    const checkBoost = async () => {
      const res = await fetch("/api/check-boost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({ postId: post.id }),
      });
      const result = await res.json();
      setIsBoosted(result.isBoosted);
    };
    checkBoost();
  }, [post.id]);

  const handleBoostToggle = async () => {
    const endpoint = isBoosted ? "/api/unboost" : "/api/boost";
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId: post.id }),
    });
    const result = await res.json();
    if (result.success) {
      setIsBoosted(!isBoosted);
    }
  };

  return (
    <Card className="rounded-2xl shadow-md bg-zinc-900 text-white mb-4">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Image
            src="/ai-avatar.svg"
            alt="Avatar"
            width={24}
            height={24}
            className="rounded-full"
          />
          <span className="text-xs text-zinc-400">{timeAgo}</span>
        </div>

        {post.type === "text" && (
          <p className="text-sm whitespace-pre-wrap mb-2">{post.content}</p>
        )}

        {post.type === "image" && (
          <Image
            src={post.content}
            alt="Post image"
            width={800}
            height={400}
            className="rounded-xl mb-2"
          />
        )}

        {post.type === "poll" && (
          <div className="text-sm space-y-1 mb-2">
            {post.content.split("\n").map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        )}

        {post.type === "link" && (
          <a
            href={post.content}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline text-sm"
          >
            {post.content}
          </a>
        )}

        {post.type === "video" && (
          <video
            src={post.content}
            controls
            className="w-full rounded-xl mb-2"
          />
        )}

        <div className="flex justify-between items-center mt-3">
          <span className="text-xs text-orange-400">
            {isBoosted ? "🔥 Boosted" : " "}
          </span>
          <button
            onClick={handleBoostToggle}
            className={`text-xs px-3 py-1 rounded-full ${
              isBoosted
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isBoosted ? "❌ Unboost" : "⚡ Boost Post"}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
