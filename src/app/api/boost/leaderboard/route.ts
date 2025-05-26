import { NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabaseServerClient";

export async function GET() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("boosts")
    .select("post_id, posts(content)")
    .group("post_id, posts(content)")
    .count("post_id", { alias: "boost_count" })
    .order("boost_count", { ascending: false })
    .limit(10);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
