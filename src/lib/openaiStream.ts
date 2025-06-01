import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export type ChatCompletionRequestMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

export async function OpenAIStream(
  messages: ChatCompletionRequestMessage[]
): Promise<string> {
  const chat = await openai.chat.completions.create({
    model: "gpt-4",
    messages,
  });

  return chat.choices[0]?.message.content || "No response.";
}
