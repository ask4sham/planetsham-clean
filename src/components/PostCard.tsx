// /src/components/PostCard.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { getSession, useSession } from "next-auth/react"; // ✅ Added useSession

export type Post = {
  id: string;
  content: string;
  model?: string;
  tags?: string[];
  created_at?: string;
  scheduled_at?: string;
  published?: boolean;
};

type Props = {
  post: Post;
  onUpdateId?: (oldId: string, newId: string) => void;
};

export function PostCard({ post, onUpdateId }: Props) {
  const [isBoosted, setIsBoosted] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const { data: session } = useSession(); // ✅ Track session reactively

  const timeAgo = post.created_at
    ? formatDistanceToNow(new Date(post.created_at), { addSuffix: true })
    : "Just now";

  useEffect(() => {
    if (session?.user?.email) {
      setSessionEmail(session.user.email);
    }

    console.log("🧪 Auth Session:", session); // ✅ Confirm session is working

    const checkBoost = async () => {
      const res = await fetch("/api/check-boost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: post.id }),
      });
      const result = await res.json();
      setIsBoosted(result.isBoosted);
    };

    checkBoost();
  }, [post.id, session]);

  const toggleBoost = async () => {
    if (!sessionEmail) {
      alert("Boost failed: Missing user email");
      return;
    }

    const res = await fetch("/api/boost", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId: post.id }),
    });

    const result = await res.json();

    if (result.success) {
      setIsBoosted(result.action === "boosted");
    } else {
      console.error("❌ Boost/unboost failed", result.error);
      alert(`Boost failed: ${result.error}`);
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scheduled_id: post.id, content: post.content }),
      });
      const data = await res.json();
      if (!data?.post_id) throw new Error("Missing post_id in response");

      if (data.post_id !== post.id && onUpdateId) {
        onUpdateId(post.id, data.post_id);
      }

      alert("✅ Published successfully! You may now Boost.");
    } catch (err) {
      console.error("Publish error:", err);
      alert(`Publish failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setPublishing(false);
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

        <p className="text-sm whitespace-pre-wrap mb-2">{post.content}</p>

        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-orange-400">
            {isBoosted ? "🔥 Boosted" : "🔥 Not Boosted"}
          </span>
          <div className="flex gap-2">
            <button
              onClick={toggleBoost}
              className={`text-xs px-3 py-1 rounded-full text-white ${
                isBoosted ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isBoosted ? "❌ Unboost" : "⚡ Boost Post"}
            </button>
            <button
              onClick={handlePublish}
              disabled={publishing || post.published}
              className={`bg-blue-600 text-white text-xs px-3 py-1 rounded-full hover:bg-blue-700 ${
                post.published ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {publishing ? "Publishing..." : post.published ? "Published" : "Publish"}
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
