import { NextRequest } from "next/server";
import { countBy } from "lodash";

type Post = {
  tags: string[];
  scheduledAt?: string;
};

export async function GET(req: NextRequest) {
  const posts: Post[] = [
    { tags: ["ai", "news"], scheduledAt: "2025-05-21T09:00" },
    { tags: ["news"], scheduledAt: "2025-05-22T10:30" },
    { tags: ["ai"], scheduledAt: "2025-05-23T15:00" },
  ];

  const totalPosts = posts.length;
  const tagsCount = countBy(posts.flatMap((post) => post.tags));
  const monthlyCount = countBy(posts, (p) => {
    const date = new Date(p.scheduledAt || Date.now());
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  });

  return Response.json({
    totalPosts,
    tagsCount,
    monthlyCount,
  });
}
