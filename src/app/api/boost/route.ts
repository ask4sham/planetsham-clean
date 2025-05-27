import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: Request) {
  const { postId } = await req.json();

  const session = await getServerSession(authOptions);

  // ✅ Force extract `sub` or fallback to test user ID
  const userId = (session?.user as any)?.sub ?? "11111111-1111-1111-1111-111111111111";

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase.from("boosts").insert({
    post_id: postId,
    user_id: userId,
    boosted_at: new Date().toISOString(),
  });

  if (error) {
    console.error("❌ Boost insert failed:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
