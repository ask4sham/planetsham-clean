// /src/app/api/auto-publish/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";

export async function POST() {
  const now = new Date().toISOString();

  // 1. Get all scheduled posts due now or earlier
  const { data: duePosts, error: fetchError } = await supabase
    .from("scheduled_posts")
    .select("*")
    .lte("scheduled_at", now);

  if (fetchError) {
    console.error("❌ Fetch error:", fetchError.message);
    return NextResponse.json({ success: false, error: fetchError.message }, { status: 500 });
  }

  if (!duePosts || duePosts.length === 0) {
    return NextResponse.json({ success: true, message: "No posts to publish" });
  }

  // 2. Insert each into `posts` table
  const postsToInsert = duePosts.map((p) => ({
    id: uuidv4(),
    output: p.output,
    model: p.model || "GPT-4",
    created_at: now,
    scheduled_at: p.scheduled_at || now,
    tags: p.tags || [],
  }));

  const { error: insertError } = await supabase.from("posts").insert(postsToInsert);

  if (insertError) {
    console.error("❌ Insert error:", insertError.message);
    return NextResponse.json({ success: false, error: insertError.message }, { status: 500 });
  }

  // 3. Delete scheduled posts that were published
  const idsToDelete = duePosts.map((p) => p.id);
  await supabase.from("scheduled_posts").delete().in("id", idsToDelete);

  return NextResponse.json({ success: true, published: postsToInsert.length });
}
