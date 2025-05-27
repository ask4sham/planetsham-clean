import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: Request) {
  const { postId } = await req.json();

  const session = await getServerSession(authOptions);
  const user = session?.user || {};
  
  // ⚠️ TEMP fallback for testing
  const userId = (user as { id?: string })?.id || "test-user-id";

  console.log("🔍 Boosting postId:", postId);
  console.log("🧑‍💻 User ID:", userId);

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
