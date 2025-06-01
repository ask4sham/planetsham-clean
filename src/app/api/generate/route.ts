// src/app/api/generate/route.ts
import { NextResponse } from "next/server";
import { generateWithGPT, generateWithMistral } from "@/lib/aiClient";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  const { prompt, model } = await req.json();

  try {
    let content = "";
    let tokens = 0;

    if (model === "mistral-7b") {
      const result = await generateWithMistral(prompt);
      content = result.output;
      tokens = result.tokens;
    } else {
      const result = await generateWithGPT(prompt);
      content = result.output;
      tokens = result.tokens;
    }

    // ✅ Save content and model used to Supabase
    const { error } = await supabase.from("generated_posts").insert([
      {
        content,
        prompt,
        model_used: model === "mistral-7b" ? "Mistral" : "GPT-4",
      },
    ]);

    if (error) {
      console.error("❌ Supabase insert error:", error.message);
      return NextResponse.json({ error: "Failed to save post" }, { status: 500 });
    }

    return NextResponse.json({
      output: content,
      estimatedCost: model === "gpt-4" ? 0.03 : 0.0005,
      tokens,
    });
  } catch (error) {
    console.error("AI generation error:", error);
    return NextResponse.json({ output: "[Error generating response]" });
  }
}
