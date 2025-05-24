import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST() {
  try {
    const now = new Date().toISOString();
    console.log("📅 Running cron at:", now);

    // 1. Fetch due posts
    const { data: posts, error: fetchError } = await supabase
      .from("posts")
      .select("*")
      .eq("published", false)
      .lte("schedule_at", now); // safer than .lt

    if (fetchError) {
      console.error("❌ Fetch error:", fetchError.message);
      throw new Error(`Fetch error: ${fetchError.message}`);
    }

    if (!posts || posts.length === 0) {
      console.log("✅ No posts to publish.");
      return NextResponse.json({ published: 0, remaining: 0 });
    }

    const ids = posts.map((post) => post.id);
    console.log("📝 Publishing posts with IDs:", ids);

    const { error: updateError } = await supabase
      .from("posts")
      .update({ published: true, published_at: now })
      .in("id", ids);

    if (updateError) {
      console.error("❌ Update error:", updateError.message);
      throw new Error(`Update error: ${updateError.message}`);
    }

    console.log(`✅ Published ${ids.length} post(s).`);
    return NextResponse.json({ published: ids.length, remaining: 0 });
  } catch (err: any) {
    console.error("❌ Exception in cron/publish:", err.message || err);
    return NextResponse.json({ error: "Failed to publish posts" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, msg: "GET /api/cron/publish works" });
}
