// /src/app/api/posts/scheduled/route.ts
import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { output, model, scheduled_at } = await req.json();

    // ✅ Insert only matching fields
    const { error } = await supabase.from("scheduled_posts").insert([
      {
        content: output || "No content",
        model_used: model,
        scheduled_at,
      },
    ]);

    if (error) {
      console.error("❌ Supabase insert error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("❌ Unexpected error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
