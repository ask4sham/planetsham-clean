// /src/app/api/publish-to-feed/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  const { id, content } = await req.json();

  if (!id || !content) {
    return NextResponse.json({ success: false, error: "Missing ID or content" });
  }

  try {
    // 1. Save to published_posts
    await supabase.from("published_posts").insert([{ content }]);

    // 2. Delete from generated_posts
    await supabase.from("generated_posts").delete().eq("id", id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error publishing:", error);
    return NextResponse.json({ success: false, error: "Failed to publish" });
  }
}
