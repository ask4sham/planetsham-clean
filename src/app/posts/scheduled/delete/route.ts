import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "scheduled-posts.json");

export async function POST(req: Request) {
  try {
    const { index } = await req.json();

    const raw = fs.readFileSync(filePath, "utf-8");
    const posts = JSON.parse(raw);

    if (index < 0 || index >= posts.length) {
      return NextResponse.json({ error: "Invalid index" }, { status: 400 });
    }

    posts.splice(index, 1); // Remove the post at the given index

    fs.writeFileSync(filePath, JSON.stringify(posts, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
