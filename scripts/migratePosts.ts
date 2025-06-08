// /scripts/migratePosts.ts

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function normalizeContent(content: any): string {
  if (!content) return "";
  if (typeof content === "string") return content;
  if (typeof content === "object") {
    return content.output || content.data?.output || JSON.stringify(content);
  }
  return String(content);
}

async function migrate() {
  const { data, error } = await supabase
    .from("generated_posts")
    .select("id, content");

  if (error) {
    console.error("❌ Fetch error:", error.message);
    return;
  }

  for (const post of data!) {
    const normalized = normalizeContent(post.content);
    if (normalized !== post.content) {
      const { error: updateError } = await supabase
        .from("generated_posts")
        .update({ content: normalized })
        .eq("id", post.id);

      if (updateError) {
        console.error(`❌ Failed to update post ${post.id}:`, updateError.message);
      } else {
        console.log(`✅ Post ${post.id} normalized.`);
      }
    }
  }

  console.log("🎉 Migration complete.");
}

migrate();
