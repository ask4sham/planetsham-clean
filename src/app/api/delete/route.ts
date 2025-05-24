// src/app/api/posts/scheduled/delete/route.ts
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "data", "scheduled-posts.json");

export async function POST(req: Request) {
  const { index } = await req.json();

  const file = await fs.readFile(filePath, "utf-8");
  const posts = JSON.parse(file);

  if (index < 0 || index >= posts.length) {
    return NextResponse.json({ success: false, error: "Invalid index" });
  }

  posts.splice(index, 1);

  await fs.writeFile(filePath, JSON.stringify(posts, null, 2));

  return NextResponse.json({ success: true });
}
