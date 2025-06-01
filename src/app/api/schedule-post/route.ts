// /src/app/api/schedule-post/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  const { content, scheduledAt } = await req.json();

  if (!content || !scheduledAt) {
    return NextResponse.json({ success: false, error: "Missing content or date." });
  }

  const { error } = await supabase
    .from("scheduled_posts")
    .insert([{ content, scheduled_at: scheduledAt }]);

  if (error) {
    console.error("Schedule insert failed:", error);
    return NextResponse.json({ success: false });
  }

  return NextResponse.json({ success: true });
}
