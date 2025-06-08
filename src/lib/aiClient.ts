// /src/lib/aiClient.ts

export async function generateWithGPT(prompt: string): Promise<{ output: string; tokens: number }> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("Missing OPENAI_API_KEY");

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("❌ GPT-4 error:", data);
    throw new Error(data.error?.message || "OpenAI API failed");
  }

  return {
    output: data.choices?.[0]?.message?.content?.trim() || "[No response from GPT-4]",
    tokens: data.usage?.total_tokens || 0,
  };
}

export async function generateWithMistral(prompt: string): Promise<{ output: string; tokens: number }> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("Missing OPENROUTER_API_KEY");

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "mistralai/mistral-7b-instruct",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("❌ Mistral error:", data);
    throw new Error(data.error?.message || "OpenRouter API failed");
  }

  return {
    output: data.choices?.[0]?.message?.content?.trim() || "[No response from Mistral]",
    tokens: data.usage?.total_tokens || 0,
  };
}
