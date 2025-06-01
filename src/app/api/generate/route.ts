import { NextResponse } from "next/server";
import { generateWithGPT, generateWithMistral } from "@/lib/aiClient";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  const { prompt, model } = await req.json();

  let output = "";

  try {
    if (model === "mistral-7b") {
      output = await generateWithMistral(prompt);
    } else {
      output = await generateWithGPT(prompt);
    }

    const content = typeof output === "string" ? output : JSON.stringify(output);

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
      tokens: model === "gpt-4" ? 800 : 400,
    });
  } catch (error) {
    console.error("AI generation error:", error);
    return NextResponse.json({ output: "[Error generating response]" });
  }
}
