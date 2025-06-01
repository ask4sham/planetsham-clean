// /src/app/api/boost/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: Request) {
  try {
    const { postId } = await req.json();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized: Missing user ID or email" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const userEmail = session.user.email;

    // Check if already boosted
    const { data: existing, error: lookupError } = await supabase
      .from("boosts")
      .select("id")
      .eq("post_id", postId)
      .eq("user_id", userId)
      .maybeSingle();

    if (lookupError) {
      console.error("❌ Lookup error:", lookupError.message);
      return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
    }

    if (existing) {
      const { error: deleteError } = await supabase
        .from("boosts")
        .delete()
        .eq("id", existing.id);

      if (deleteError) {
        console.error("❌ Unboost error:", deleteError.message);
        return NextResponse.json({ error: "Unboost failed" }, { status: 500 });
      }

      return NextResponse.json({ action: "unboosted", success: true });
    }

    const { error: insertError } = await supabase.from("boosts").insert({
      post_id: postId,
      user_id: userId,
      user_email: userEmail,
      boosted_at: new Date().toISOString(),
    });

    if (insertError) {
      console.error("❌ Boost error:", insertError.message);
      return NextResponse.json({ error: "Boost failed" }, { status: 500 });
    }

    return NextResponse.json({ action: "boosted", success: true });
  } catch (err) {
    console.error("❌ Boost handler error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
