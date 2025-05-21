import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const scheduledFilePath = path.join(process.cwd(), "scheduled-posts.json");

export async function GET() {
  try {
    if (!fs.existsSync(scheduledFilePath)) return NextResponse.json([]);

    const raw = fs.readFileSync(scheduledFilePath, "utf-8");
    const posts = JSON.parse(raw);
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load scheduled posts." },
      { status: 500 }
    );
  }
}
