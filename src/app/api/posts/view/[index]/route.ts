import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(
  req: Request,
  context: { params: { index: string } }
) {
  const blogFilePath = path.join(process.cwd(), "public", "blog.json");

  try {
    const index = parseInt(context.params.index);
    if (isNaN(index)) {
      return NextResponse.json({ error: "Invalid index" }, { status: 400 });
    }

    const raw = fs.readFileSync(blogFilePath, "utf-8");
    const posts = JSON.parse(raw);

    if (!Array.isArray(posts) || !posts[index]) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    posts[index].views = (posts[index].views || 0) + 1;

    fs.writeFileSync(blogFilePath, JSON.stringify(posts, null, 2));
    return NextResponse.json({ success: true, views: posts[index].views });
  } catch (error) {
    console.error("❌ View increment error:", error);
    return NextResponse.json({ error: "Failed to update views" }, { status: 500 });
  }
}
