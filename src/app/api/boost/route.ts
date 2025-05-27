import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: Request) {
  const { postId } = await req.json();

  const session = await getServerSession(authOptions);
  const user = session?.user;

  console.log("🔍 Debug boost request:");
  console.log("Session:", session);
  console.log("User ID:", user?.id);

  const userId = (user as { id?: string })?.id;

  if (!userId) {
    console.error("❌ No user ID found. Boost aborted.");
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

  console.log("✅ Boost recorded successfully.");
  return NextResponse.json({ success: true });
}
