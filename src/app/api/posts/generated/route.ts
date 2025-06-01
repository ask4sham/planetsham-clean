// /src/app/api/posts/generated/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// Normalizer
function normalizeContent(content: any): string {
  if (typeof content === "string") return content;
  if (typeof content === "object" && content.output) return content.output;
  return JSON.stringify(content);
}

export async function GET() {
  const { data, error } = await supabase
    .from("generated_posts")
    .select("id, content, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("Supabase Error:", error);
    return NextResponse.json([], { status: 500 });
  }

  // Normalize before sending
  const processed = (data ?? []).map((post) => ({
    ...post,
    content: normalizeContent(post.content),
  }));

  return NextResponse.json(processed, {
    headers: { "Cache-Control": "s-maxage=60" },
  });
}
