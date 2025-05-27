"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";

type PostCardProps = {
  content: string;
  publishedAt?: string;
};

export function PostCard({ content, publishedAt }: PostCardProps) {
  const timeAgo = publishedAt
    ? formatDistanceToNow(new Date(publishedAt), { addSuffix: true })
    : "Just now";

  const [boosted, setBoosted] = useState(false);

  const handleBoost = async () => {
    await fetch("/api/boost", {
      method: "POST",
      body: JSON.stringify({ postId: content }),
    });
    setBoosted(true);
  };

  return (
    <Card className="rounded-2xl shadow-md bg-zinc-900 text-white">
      <CardContent className="p-4 flex flex-col gap-2">
        <div className="flex gap-4 items-start">
          <div className="w-8 h-8 relative">
            <Image
              src="/ai-avatar.svg"
              alt="AI"
              width={32}
              height={32}
              className="rounded-full"
            />
          </div>
          <div className="flex-1">
            <p>{content}</p>
            <p className="text-xs text-zinc-400 mt-1">{timeAgo}</p>
          </div>
        </div>
        <button
          onClick={handleBoost}
          disabled={boosted}
          className={`px-3 py-1 rounded-xl text-sm ${
            boosted ? "bg-green-700" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {boosted ? "✅ Boosted" : "⚡ Boost Post"}
        </button>
      </CardContent>
    </Card>
  );
}
