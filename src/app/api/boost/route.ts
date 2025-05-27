import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: Request) {
  const { postId } = await req.json();
  const session = await getServerSession(authOptions);

  // 1. Get user ID (prioritize `id` after NextAuth fixes)
  const userId = session?.user?.id || session?.user?.sub;
  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized: Missing user ID" },
      { status: 401 }
    );
  }

  // 2. Check for existing boost
  const { data: existingBoost, error: lookupError } = await supabase
    .from("boosts")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle();

  if (lookupError) {
    return NextResponse.json(
      { error: "Database lookup failed" },
      { status: 500 }
    );
  }

  // 3. Toggle boost/unboost
  if (existingBoost) {
    // Unboost: Delete existing record
    const { error: deleteError } = await supabase
      .from("boosts")
      .delete()
      .eq("id", existingBoost.id);

    if (deleteError) {
      return NextResponse.json(
        { error: "Failed to unboost" },
        { status: 500 }
      );
    }
    return NextResponse.json({ action: "unboosted", success: true });
  } else {
    // Boost: Insert new record
    const { error: insertError } = await supabase
      .from("boosts")
      .insert({
        post_id: postId,
        user_id: userId,
        boosted_at: new Date().toISOString(),
      });

    if (insertError) {
      return NextResponse.json(
        { error: "Failed to boost" },
        { status: 500 }
      );
    }
    return NextResponse.json({ action: "boosted", success: true });
  }
}