// /src/app/api/posts/generated/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  const { data, error } = await supabase
    .from("generated_posts")
    .select("id, content, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching drafts:", error);
    return NextResponse.json([]);
  }

  return NextResponse.json(data);
}
