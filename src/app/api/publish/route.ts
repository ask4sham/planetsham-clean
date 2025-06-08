// /src/app/api/publish/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const { scheduled_id, output, model = "GPT-4", tags = [] } = await req.json();
    const id = uuidv4();
    const now = new Date().toISOString();

    // ✅ Insert into `posts` table
    const { error: insertError } = await supabase.from("posts").insert([
      {
        id,
        output,
        model,
        created_at: now,
        scheduled_at: now,
        tags,
      },
    ]);

    if (insertError) {
      console.error("❌ Failed to insert post:", insertError.message);
      return NextResponse.json({ success: false, error: insertError.message }, { status: 500 });
    }

    // ✅ Remove it from `scheduled_posts` if it came from there
    if (scheduled_id) {
      await supabase.from("scheduled_posts").delete().eq("id", scheduled_id);
    }

    return NextResponse.json({ success: true, post_id: id });
  } catch (err) {
    console.error("❌ Unexpected error:", err);
    return NextResponse.json({ success: false, error: "Unexpected error" }, { status: 500 });
  }
}
