// /src/app/api/schedule-post/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { logger } from "@/lib/logger"; // ✅ Server-safe logger

export async function POST(req: Request) {
  const { content, scheduledAt } = await req.json();

  if (!content || !scheduledAt) {
    return NextResponse.json({ success: false, error: "Missing content or date." });
  }

  // ✅ Optional: backup locally for debugging
  await logger.backup({ content, scheduledAt }, "schedule_post");

  const { error } = await supabase
    .from("scheduled_posts")
    .insert([{ content, scheduled_at: scheduledAt }]);

  if (error) {
    console.error("❌ Schedule insert failed:", error.message);
    return NextResponse.json({ success: false, error: error.message });
  }

  return NextResponse.json({ success: true });
}
