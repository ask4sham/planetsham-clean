import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const scheduledPath = path.join(process.cwd(), "src", "data", "scheduled-posts.json");
const publishedPath = path.join(process.cwd(), "src", "data", "published-posts.json");

export async function POST() {
  try {
    const [scheduledData, publishedData] = await Promise.all([
      fs.readFile(scheduledPath, "utf-8"),
      fs.readFile(publishedPath, "utf-8"),
    ]);

    const scheduledPosts = JSON.parse(scheduledData);
    const publishedPosts = JSON.parse(publishedData);

    const now = new Date();
    const remainingPosts = [];
    const newlyPublished = [];

    for (const post of scheduledPosts) {
      if (new Date(post.scheduledAt) <= now) {
        newlyPublished.push(post);
      } else {
        remainingPosts.push(post);
      }
    }

    await Promise.all([
      fs.writeFile(scheduledPath, JSON.stringify(remainingPosts, null, 2)),
      fs.writeFile(publishedPath, JSON.stringify([...publishedPosts, ...newlyPublished], null, 2)),
    ]);

    return NextResponse.json({ published: newlyPublished.length, remaining: remainingPosts.length });
  } catch (err) {
    console.error("Error in cron/publish:", err);
    return NextResponse.json({ error: "Failed to publish posts" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, msg: "GET /api/cron/publish works" });
}
