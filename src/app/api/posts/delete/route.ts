import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const scheduledPath = path.join(process.cwd(), "src", "data", "scheduled-posts.json");
const publishedPath = path.join(process.cwd(), "src", "data", "published-posts.json");

export async function POST(req: NextRequest) {
  const { content, scheduledAt, type } = await req.json();

  const filePath = type === "published" ? publishedPath : scheduledPath;
  const fileData = await fs.readFile(filePath, "utf-8");
  const posts = JSON.parse(fileData);

  const filtered = posts.filter(
    (p: any) => p.content !== content || p.scheduledAt !== scheduledAt
  );

  await fs.writeFile(filePath, JSON.stringify(filtered, null, 2));

  return NextResponse.json({ success: true });
}
