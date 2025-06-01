<<<<<<< HEAD
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
=======
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: Request) {
  try {
    const { postId } = await req.json();
    console.log("🔍 Checking if boosted:", postId); // Optional debug

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ isBoosted: false }, { status: 200 });
    }

    const { data, error } = await supabase
      .from("boosts")
      .select("id")
      .eq("post_id", postId)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("❌ check-boost error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ isBoosted: !!data }, { status: 200 });
  } catch (err) {
    console.error("❌ Failed to parse check-boost request:", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
>>>>>>> 87ad8ba (📦 Save local changes before pull)
}
