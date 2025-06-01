// /src/app/api/check-boost/route.ts

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: Request) {
  try {
    const { postId } = await req.json();
    const session = await getServerSession(authOptions);

    const userId = session?.user?.id || session?.user?.sub;

    if (!userId) {
      return NextResponse.json({ isBoosted: false });
    }

    const { data, error } = await supabase
      .from("boosts")
      .select("id")
      .eq("post_id", postId)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("❌ Error checking boost:", error.message);
      return NextResponse.json({ isBoosted: false });
    }

    return NextResponse.json({ isBoosted: !!data });
  } catch (err) {
    console.error("❌ Boost check crashed:", err);
    return NextResponse.json({ isBoosted: false });
  }
}
