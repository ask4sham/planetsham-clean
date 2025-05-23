"use client";

import { useState } from "react";

export default function CopilotPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/copilot", {
      method: "POST",
      body: JSON.stringify({ input }),
    });
    const data = await res.json();
    setOutput(data.output);
    setLoading(false);
  }

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">🧠 PlanetSham Copilot</h1>
      <p className="mb-4 text-zinc-500">
        Ask me anything about your code, deployment, or PlanetSham setup.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className="w-full p-3 rounded-md border"
          rows={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g., How can I add auto-posting to my blog?"
        />
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded hover:bg-zinc-800"
        >
          {loading ? "Thinking..." : "Ask Copilot"}
        </button>
      </form>
      {output && (
        <div className="mt-6 p-4 rounded-md bg-zinc-100 dark:bg-zinc-900">
          <p>{output}</p>
        </div>
      )}
    </main>
  );
}
