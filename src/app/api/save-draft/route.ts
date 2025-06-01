// /src/app/api/save-draft/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  const { content } = await req.json();

  const { error } = await supabase.from("generated_posts").insert([{ content }]);

  if (error) {
    console.error("❌ Save failed:", error);
    return NextResponse.json({ success: false });
  }

  return NextResponse.json({ success: true });
}
