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

  const { data: existingBoost } = await supabase
    .from("boosts")
    .select("id")
    .eq("post_id", postId)
    .eq("user_email", userEmail)
    .maybeSingle();

  if (existingBoost) {
    await supabase.from("boosts").delete().eq("id", existingBoost.id);
    return NextResponse.json({ action: "unboosted", success: true });
  }

  const { error } = await supabase.from("boosts").insert({
    post_id: postId,
    user_email: userEmail,
    boosted_at: new Date().toISOString(),
  });

  if (error) {
    return NextResponse.json({ error: "Boost failed" }, { status: 500 });
  }

  return NextResponse.json({ action: "boosted", success: true });
}
