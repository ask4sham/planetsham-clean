// /src/app/api/chat/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "edge"; // required for edge functions

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // make sure this key exists
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4",
      messages,
    });

    const answer = chatCompletion.choices[0].message?.content || "No response.";
    return NextResponse.json({ output: answer });
  } catch (err) {
    console.error("Chat error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Check server logs." },
      { status: 500 }
    );
  }
}
