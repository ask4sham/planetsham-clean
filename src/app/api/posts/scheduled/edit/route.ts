// src/app/api/posts/scheduled/edit/route.ts

import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "data", "scheduled-posts.json");

export async function POST(req: Request) {
  const { index, newContent, newDate, tags } = await req.json();

  try {
    const file = await fs.readFile(filePath, "utf-8");
    const posts = JSON.parse(file);

    if (!Array.isArray(posts) || index < 0 || index >= posts.length) {
      return NextResponse.json({ error: "Invalid index" }, { status: 400 });
    }

    posts[index].content = newContent;
    posts[index].scheduledAt = newDate;
    posts[index].tags = tags;

    await fs.writeFile(filePath, JSON.stringify(posts, null, 2), "utf-8");

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update post", details: err }, { status: 500 });
  }
}
