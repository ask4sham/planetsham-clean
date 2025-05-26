"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

type PostCardProps = {
  content: string;
  publishedAt?: string;
  boostCount?: number;
  boostedByUser?: boolean;
  onBoostToggle?: () => void; // 🔥 new prop
};

export function PostCard({
  content,
  publishedAt,
  boostCount = 0,
  boostedByUser = false,
  onBoostToggle,
}: PostCardProps) {
  const timeAgo = publishedAt
    ? formatDistanceToNow(new Date(publishedAt), { addSuffix: true })
    : "Just now";

  return (
    <Card className="rounded-2xl shadow-md bg-zinc-900 text-white">
      <CardContent className="p-4 flex gap-4">
        <div className="w-8 h-8 relative transition-transform duration-300 hover:scale-110">
          <Image
            src="/ai-avatar.svg"
            alt="AI"
            width={32}
            height={32}
            className="rounded-full"
          />
        </div>

        <div className="flex-1">
          <p className="text-base mb-2">{content}</p>
          <div className="flex justify-between text-sm text-zinc-400">
            <span>{timeAgo}</span>
            <div className="flex gap-2 items-center">
              <span>👍 {boostCount} boost{boostCount !== 1 ? "s" : ""}</span>
              {boostedByUser && (
                <span className="text-emerald-400 font-medium">🔥 You boosted this</span>
              )}
            </div>
          </div>

          {onBoostToggle && (
            <button
              onClick={onBoostToggle}
              className={`mt-2 text-sm px-3 py-1 rounded-full transition-colors duration-200 ${
                boostedByUser
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-emerald-500 text-white hover:bg-emerald-600"
              }`}
            >
              {boostedByUser ? "Unboost 🔥" : "Boost 🔥"}
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
