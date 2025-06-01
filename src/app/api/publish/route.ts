// /src/app/api/publish/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST() {
  try {
    const now = new Date().toISOString();
    console.log("📅 Now is:", now);

    // 1. Fetch all scheduled posts with timestamp <= now
    const { data: duePosts, error: fetchError } = await supabase
      .from("scheduled_posts")
      .select("*")
      .lte("scheduled_at", now);

    if (fetchError) {
      console.error("❌ Error fetching scheduled posts:", fetchError);
      return NextResponse.json({ error: "Failed to fetch scheduled posts" }, { status: 500 });
    }

    console.log("📂 Found due posts:", duePosts?.length || 0);

    if (!duePosts || duePosts.length === 0) {
      return NextResponse.json({ published: [] }); // nothing to publish
    }

    // 2. Insert due posts into published_posts
    const { error: insertError } = await supabase
      .from("published_posts")
      .insert(
        duePosts.map((post) => ({
          content: post.content,
          published_at: post.scheduled_at,
        }))
      );

    if (insertError) {
      console.error("❌ Failed to insert published posts:", insertError);
      return NextResponse.json({ error: "Insert failed" }, { status: 500 });
    }

    // 3. Delete published posts from scheduled_posts
    const idsToDelete = duePosts.map((post) => post.id);
    const { error: deleteError } = await supabase
      .from("scheduled_posts")
      .delete()
      .in("id", idsToDelete);

    if (deleteError) {
      console.error("⚠️ Failed to delete scheduled posts:", deleteError);
      return NextResponse.json({ error: "Partial success – not cleaned up" }, { status: 500 });
    }

    console.log("✅ Published and deleted:", idsToDelete.length);
    return NextResponse.json({ published: duePosts });
  } catch (err) {
    console.error("🚨 Publish API Error:", err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
