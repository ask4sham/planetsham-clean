import { NextResponse } from "next/server";
import { handleBoost } from "@/lib/stripe";
import { supabase } from "@/lib/supabaseClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: Request) {
  const { postId } = await req.json();

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ✅ Insert boost record into Supabase
  await supabase.from("boosts").insert({
    post_id: postId,
    user_id: userId,
  });

  const url = await handleBoost(postId);
  return NextResponse.json({ url });
}
