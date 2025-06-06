// src/app/api/boost/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: Request) {
  const { postId } = await req.json();
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: existingBoost, error: lookupError } = await supabase
    .from("boosts")
    .select("id")
    .eq("post_id", postId)
    .eq("user_email", user.email)
    .maybeSingle();

  if (lookupError) {
    return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
  }

  if (existingBoost) {
    await supabase.from("boosts").delete().eq("id", existingBoost.id);
    return NextResponse.json({ action: "unboosted", success: true });
  }

  const { error: insertError } = await supabase.from("boosts").insert({
    post_id: postId,
    user_email: user.email,
    boosted_at: new Date().toISOString(),
  });

  if (insertError) {
    return NextResponse.json({ error: "Boost failed" }, { status: 500 });
  }

  return NextResponse.json({ action: "boosted", success: true });
}
