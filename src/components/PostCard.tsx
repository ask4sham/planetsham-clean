"use client";

import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

type PostCardProps = {
  content: string;
  publishedAt?: string;
};

export function PostCard({ content, publishedAt }: PostCardProps) {
  const timeAgo = publishedAt
    ? formatDistanceToNow(new Date(publishedAt), { addSuffix: true })
    : "Just now";

  return (
    <Card className="rounded-2xl shadow-md bg-zinc-900 text-white">
      <CardContent className="p-4 flex gap-4">
        <div className="w-8 h-8 overflow-hidden rounded-full transition-transform duration-300 hover:scale-110">
          <img
            src="/ai-avatar.svg"
            alt="AI"
            width={32}
            height={32}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <div className="text-sm text-zinc-400 mb-1">{timeAgo}</div>
          <div className="text-base leading-relaxed whitespace-pre-wrap">
            {content}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
