// src/app/api/boost/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: Request) {
  const { postId } = await req.json();
  const session = await getServerSession(authOptions);

  const userEmail = session?.user?.email;

  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if already boosted
  const { data: existingBoost, error: lookupError } = await supabase
    .from("boosts")
    .select("id")
    .eq("post_id", postId)
    .eq("user_email", userEmail)
    .maybeSingle();

  if (lookupError) {
    return NextResponse.json({ error: "Database lookup failed" }, { status: 500 });
  }

  if (existingBoost) {
    // Unboost
    const { error: deleteError } = await supabase
      .from("boosts")
      .delete()
      .eq("id", existingBoost.id);

    if (deleteError) {
      return NextResponse.json({ error: "Failed to unboost" }, { status: 500 });
    }

    return NextResponse.json({ action: "unboosted", success: true });
  }

  // Boost
  const { error: insertError } = await supabase.from("boosts").insert([
    {
      post_id: postId,
      user_email: userEmail,
      boosted_at: new Date().toISOString(),
    },
  ]);

  if (insertError) {
    return NextResponse.json({ error: "Failed to boost" }, { status: 500 });
  }

  return NextResponse.json({ action: "boosted", success: true });
}
