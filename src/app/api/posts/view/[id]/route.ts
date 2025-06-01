// /src/app/api/posts/view/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json({ error: "Post ID not found" }, { status: 400 });
    }

    console.log("✅ Received view POST for ID:", id);

    // Example: You could log this to Supabase or analytics here.

    return NextResponse.json({ message: `View recorded for ID: ${id}` });
  } catch (err) {
    console.error("❌ Error in view/[id] route:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
