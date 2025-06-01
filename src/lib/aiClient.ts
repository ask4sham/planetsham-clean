// /src/lib/aiClient.ts
export async function generateWithMistral(prompt: string): Promise<{ output: string; tokens: number }> {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "mistralai/mistral-7b-instruct",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await res.json();
  console.log("🔍 Mistral response:", JSON.stringify(data, null, 2));

  return {
    output: data.choices?.[0]?.message?.content || "[No response from Mistral]",
    tokens: data.usage?.total_tokens || 0,
  };
}

export async function generateWithGPT(prompt: string): Promise<{ output: string; tokens: number }> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await res.json();
  console.log("🔍 GPT response:", JSON.stringify(data, null, 2));

  return {
    output: data.choices?.[0]?.message?.content || "[No response from GPT-4]",
    tokens: data.usage?.total_tokens || 0,
  };
}
