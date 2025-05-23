// ✅ Correct API Route: src/app/api/copilot/route.ts

export async function POST(req: Request) {
  const body = await req.json();
  const input = body.input || "";

  // Placeholder response – replace with actual AI logic later
  const output = `Echo: ${input}`;

  return new Response(JSON.stringify({ output }), {
    headers: { "Content-Type": "application/json" },
  });
}
