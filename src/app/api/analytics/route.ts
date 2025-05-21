import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Helper to count by key
function countBy<T>(arr: T[], keyFn: (item: T) => string): Record<string, number> {
  return arr.reduce((acc, item) => {
    const key = keyFn(item);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

export async function GET() {
  try {
    const blogFile = path.join(process.cwd(), "public", "blog.json");

    if (!fs.existsSync(blogFile)) {
      return NextResponse.json({ totalPosts: 0, tagsCount: {}, monthlyCount: {} });
    }

    const posts = JSON.parse(fs.readFileSync(blogFile, "utf-8"));

    const totalPosts = posts.length;

    const tagsCount = countBy(posts.flatMap((p: any) => p.tags || []), (tag) => tag);

    const monthlyCount = countBy(posts, (p: any) => {
      const date = new Date(p.scheduledAt || Date.now());
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    });

    return NextResponse.json({ totalPosts, tagsCount, monthlyCount });
  } catch (err) {
    console.error("❌ Analytics error:", err);
    return NextResponse.json({ error: "Failed to load analytics" }, { status: 500 });
  }
}
