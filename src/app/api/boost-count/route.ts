import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  const { postId } = await req.json();
  console.log("📨 Checking boost count for postId:", postId); // log input

  const { count, error } = await supabase
    .from("boosts")
    .select("*", { count: "exact", head: true })
    .eq("post_id", postId);

  if (error) {
    console.error("❌ Boost Count Error:", error.message); // log error
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ boostCount: count || 0 });
}
