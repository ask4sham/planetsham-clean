// src/app/api/posts/published/route.ts

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const blogFilePath = path.join(process.cwd(), "blog.json");

export async function GET() {
  try {
    if (!fs.existsSync(blogFilePath)) {
      return NextResponse.json([], { status: 200 });
    }

    const data = fs.readFileSync(blogFilePath, "utf-8");
    const posts = JSON.parse(data);
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load published posts." },
      { status: 500 }
    );
  }
}
