import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

import { getScheduledPosts, updateScheduledPosts } from "../../../lib/scheduler";

// ✅ Ensure we're targeting the correct public path
const blogFilePath = path.join(process.cwd(), "public", "blog.json");

function savePublished(posts: any[]) {
  console.log("📤 Attempting to write published posts to:", blogFilePath);
  console.log("📝 Posts being saved:", posts);

  try {
    const existing = fs.existsSync(blogFilePath)
      ? JSON.parse(fs.readFileSync(blogFilePath, "utf-8"))
      : [];

    const combined = [...posts, ...existing];

    // ✅ Sort by most recent first
    combined.sort((a, b) =>
      (b.scheduledAt || "").localeCompare(a.scheduledAt || "")
    );

    fs.writeFileSync(blogFilePath, JSON.stringify(combined, null, 2));
    console.log("✅ blog.json updated successfully");
  } catch (error) {
    console.error("❌ Failed to write to blog.json:", error);
  }
}

export async function GET() {
  try {
    const { ready, future } = getScheduledPosts();

    updateScheduledPosts(future); // Save future queue
    savePublished(ready);         // Append new published posts

    return NextResponse.json({ published: ready, remaining: future.length });
  } catch (error) {
    console.error("❌ Error in GET /api/publish:", error);
    return NextResponse.json(
      { error: "Failed to publish scheduled posts." },
      { status: 500 }
    );
  }
}
