// /src/app/api/generate/route.ts
import { NextResponse } from "next/server";
import { generateWithGPT, generateWithMistral } from "@/lib/aiClient";
import { supabase } from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";

type GenerationRequest = {
  prompt: string;
  model: "gpt-4" | "mistral-7b";
};

export async function POST(req: Request) {
  try {
    const { prompt, model } = (await req.json()) as GenerationRequest;

    console.log("🧪 Prompt received:", prompt);
    console.log("🧪 Model selected:", model);

    const outputRAW =
      model === "mistral-7b"
        ? await generateWithMistral(prompt)
        : await generateWithGPT(prompt);

    const output = typeof outputRAW === "string" ? outputRAW : JSON.stringify(outputRAW);
    const now = new Date().toISOString();
    const id = uuidv4();

    // ✅ Insert into Supabase using correct schema
    const { error: insertError } = await supabase
      .from("posts")
      .insert([
        {
          id,
          output,         // ✅ Must match column name in Supabase
          model,
          created_at: now,
          scheduled_at: now,
          tags: [],       // ✅ Empty array for now
        },
      ]);

    if (insertError) {
      console.error("❌ Failed to insert post:", insertError.message);
      return NextResponse.json({ error: "Post insert failed" }, { status: 500 });
    }

    console.log("✅ Post inserted with ID:", id);
    return NextResponse.json(
      {
        id,
        output,
      },
      {
        status: 200,
        headers: {
          "X-Content-Type-Options": "nosniff",
          "X-Frame-Options": "DENY",
        },
      }
    );
  } catch (err) {
    console.error("❌ Post generation error:", err);
    return NextResponse.json({ error: "Generation error" }, { status: 500 });
  }
}
