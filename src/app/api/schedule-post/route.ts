// /src/app/api/schedule-post/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { logger } from "@/lib/logger"; // ✅ Add logger import

export async function POST(req: Request) {
  const { content, scheduledAt } = await req.json();

  if (!content || !scheduledAt) {
    return NextResponse.json({ success: false, error: "Missing content or date." });
  }

  // ✅ Backup locally
  await logger.backup({ content, scheduledAt }, "schedule_post");

  // ✅ Insert into Supabase
  const { error } = await supabase
    .from("scheduled_posts")
    .insert([{ content, scheduled_at: scheduledAt }]);

  if (error) {
    console.error("❌ Schedule insert failed:", error.message);
    return NextResponse.json({ success: false, error: error.message }); // ← Expose reason
  }

  return NextResponse.json({ success: true });
}
