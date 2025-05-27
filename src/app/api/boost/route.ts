import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { postId } = await req.json();

  const session = await getServerSession(authOptions);
  const user = session?.user;

  // 🔍 Supabase user ID is under 'sub'
  const userId = session?.token?.sub || session?.user?.id;

  console.log("🔍 Boosting postId:", postId);
  console.log("🧑‍💻 User ID:", userId);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase.from("boosts").insert({
    post_id: postId,
    user_id: userId,
  });

  if (error) {
    console.error("❌ Boost insert failed:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
