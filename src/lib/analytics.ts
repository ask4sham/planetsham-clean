import fs from "fs";
import path from "path";

type Post = {
  content: string;
  scheduledAt?: string;
  tags?: string[];
};

export function getAnalytics() {
  const filePath = path.join(process.cwd(), "public", "blog.json");
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const posts: Post[] = JSON.parse(raw);

  const totalPosts = posts.length;

  const tagsCount: Record<string, number> = {};
  const monthlyCount: Record<string, number> = {};

  for (const post of posts) {
    // Count tags
    (post.tags || []).forEach(tag => {
      tagsCount[tag] = (tagsCount[tag] || 0) + 1;
    });

    // Count per month
    if (post.scheduledAt) {
      const date = new Date(post.scheduledAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      monthlyCount[key] = (monthlyCount[key] || 0) + 1;
    }
  }

  return {
    totalPosts,
    tagsCount,
    monthlyCount
  };
}
