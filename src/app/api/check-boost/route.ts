// src/app/api/check-boost/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: Request) {
  try {
    const { postId } = await req.json();
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    if (!email) {
      return NextResponse.json({ isBoosted: false }, { status: 200 });
    }

    const { data, error } = await supabase
      .from("boosts")
      .select("id")
      .eq("post_id", postId)
      .eq("user_email", email)
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
}
