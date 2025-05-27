import { supabase } from "@/lib/supabaseClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { postId } = await req.json();
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id ?? "11111111-1111-1111-1111-111111111111";

  const { data } = await supabase
    .from("boosts")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle();

  return NextResponse.json({ boosted: !!data, success: true });
}
