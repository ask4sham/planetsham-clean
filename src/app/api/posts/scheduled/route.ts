// /src/app/api/posts/scheduled/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  const { data, error } = await supabase
    .from("scheduled_posts")
    .select("content, scheduled_at")
    .order("scheduled_at", { ascending: true });

  if (error) {
    console.error("Error fetching scheduled posts:", error);
    return NextResponse.json([]);
  }

  return NextResponse.json(data);
}
