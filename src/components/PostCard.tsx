"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
        <Avatar>
          <AvatarImage src="/ai-avatar.png" alt="AI" />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
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
