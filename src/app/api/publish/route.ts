import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

// ✅ Updated paths
const scheduledPath = path.join(process.cwd(), "src/data/scheduled-posts.json");
const publishedPath = path.join(process.cwd(), "src/data/published-posts.json");

export async function POST() {
  try {
    const [scheduledRaw, publishedRaw] = await Promise.all([
      fs.readFile(scheduledPath, "utf-8"),
      fs.readFile(publishedPath, "utf-8"),
    ]);

    const scheduled = JSON.parse(scheduledRaw);
    const published = JSON.parse(publishedRaw);

    const now = new Date();
    const stillScheduled = [];
    const newlyPublished = [];

    for (const post of scheduled) {
      const postTime = new Date(post.scheduled_at || post.scheduledAt); // handle both formats

      console.log(`⏰ Now: ${now.toISOString()}`);
      console.log(`📝 Post: ${post.content}`);
      console.log(`📅 Scheduled for: ${postTime.toISOString()}`);

      if (postTime <= now) {
        newlyPublished.push(post);
      } else {
        stillScheduled.push(post);
      }
    }

    if (newlyPublished.length > 0) {
      await Promise.all([
        fs.writeFile(scheduledPath, JSON.stringify(stillScheduled, null, 2)),
        fs.writeFile(publishedPath, JSON.stringify([...published, ...newlyPublished], null, 2)),
      ]);
    }

    return NextResponse.json({ published: newlyPublished });
  } catch (err) {
    console.error("🚨 Auto publish error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
