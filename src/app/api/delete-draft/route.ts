// /src/app/api/delete-draft/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ success: false, error: "Missing ID" });
  }

  const { error } = await supabase.from("generated_posts").delete().eq("id", id);

  if (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ success: false });
  }

  return NextResponse.json({ success: true });
}
