// /src/app/api/save-draft/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { serverLogger } from "@/lib/serverLogger"; // ✅ Server-safe logger

export async function POST(req: Request) {
  const { content } = await req.json();

  // ✅ Optional local backup for debugging
  serverLogger.backup({ content }, "draft_save");

  const { error } = await supabase.from("generated_posts").insert([{ content }]);

  if (error) {
    console.error("❌ Save failed:", error);
    return NextResponse.json({ success: false });
  }

  return NextResponse.json({ success: true });
}
