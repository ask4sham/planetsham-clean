import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: Request) {
  const { postId } = await req.json();
  const session = await getServerSession(authOptions);
  const user = session?.user || {};
  const userId = (user as { id?: string })?.id || "test-user-id";

  const { error } = await supabase
    .from("boosts")
    .delete()
    .match({ post_id: postId, user_id: userId });

  if (error) {
    console.error("❌ Unboost failed:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
