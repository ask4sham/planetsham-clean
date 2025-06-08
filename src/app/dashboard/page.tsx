'use client';

import { useState, useEffect } from "react";

type Post = {
  id?: number;
  content: string;
  created_at?: string;
};

type Scheduled = {
  content: string;
  scheduled_at: string;
};

export default function DashboardPage() {
  const [drafts, setDrafts] = useState<Post[]>([]);
  const [scheduled, setScheduled] = useState<Scheduled[]>([]);
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [selectedModel, setSelectedModel] = useState<"gpt-4" | "mistral-7b">("gpt-4");
  const [tokens, setTokens] = useState(0);
  const [cost, setCost] = useState(0);
  const [output, setOutput] = useState("");
  const [editingDraftId, setEditingDraftId] = useState<number | null>(null);
  const [scheduleDate, setScheduleDate] = useState("");

  useEffect(() => {
    fetch("/api/posts/generated").then(res => res.json()).then(setDrafts).catch(() => setDrafts([]));
    fetch("/api/posts/scheduled").then(res => res.json()).then(setScheduled).catch(() => setScheduled([]));
  }, []);

  const generatePost = async () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    setOutput("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, model: selectedModel }),
      });

      const data = await res.json();
      setOutput(data.output || "[No response]");
      setTokens(data.tokens || 0);
      setCost(data.estimatedCost || 0);
    } catch {
      setOutput("[Error generating response]");
    }

    setGenerating(false);
  };

  const resetFields = () => {
    setPrompt("");
    setOutput("");
    setScheduleDate("");
    setEditingDraftId(null);
    setTokens(0);
    setCost(0);
  };

  const saveDraft = async () => {
    if (!output.trim()) return;

    const res = await fetch("/api/save-draft", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: output, id: editingDraftId }),
    });

    const data = await res.json();
    if (data.success) {
      alert(editingDraftId ? "✅ Draft updated!" : "✅ Draft saved!");
      const updated = await fetch("/api/posts/generated").then(res => res.json());
      setDrafts(updated);
      resetFields();
    } else {
      alert("❌ Failed to save draft.");
    }
  };

  const schedulePost = async () => {
    if (!output.trim() || !scheduleDate) {
      alert("⏳ Provide content and schedule time.");
      return;
    }

    const res = await fetch("/api/schedule-post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: output, scheduledAt: scheduleDate }),
    });

    const data = await res.json();
    if (data.success) {
      alert("📅 Post scheduled!");
      const updated = await fetch("/api/posts/scheduled").then(res => res.json());
      setScheduled(updated);
      resetFields();
    } else {
      alert("❌ Failed to schedule.");
    }
  };

  return (
    <main className="p-6 max-w-3xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-6">📊 Dashboard</h1>

      <div className="mb-4">
        <label className="text-sm font-medium mr-2">AI Model:</label>
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value as "gpt-4" | "mistral-7b")}
          className="bg-zinc-800 text-white p-2 rounded"
        >
          <option value="gpt-4">GPT-4</option>
          <option value="mistral-7b">Mistral 7B</option>
        </select>
      </div>

      <div className="mb-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
          className="w-full p-3 text-black rounded mb-2"
          rows={4}
        />
        <div className="flex gap-2">
          <button
            onClick={generatePost}
            className="bg-blue-600 px-4 py-2 rounded text-white"
            disabled={generating}
          >
            {generating ? "Generating..." : "Generate Post"}
          </button>
          <button
            onClick={resetFields}
            className="bg-gray-600 px-4 py-2 rounded text-white"
          >
            🔄 Reset
          </button>
        </div>
      </div>

      <div className="mb-6 text-sm text-zinc-400">
        <p>📦 Tokens used: <span className="font-semibold">{tokens}</span></p>
        <p>💰 Estimated cost: <span className="font-semibold">${cost.toFixed(6)}</span></p>
      </div>

      {output && (
        <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-700 mb-6">
          <h2 className="text-lg font-semibold mb-2">🧠 AI Output</h2>
          <p className="whitespace-pre-wrap text-sm text-white">{output}</p>
          <div className="flex gap-4 mt-4 flex-wrap">
            <button onClick={saveDraft} className="bg-green-600 text-white px-4 py-2 rounded">💾 Save as Draft</button>
            <button onClick={() => setPrompt(output)} className="bg-yellow-500 text-white px-4 py-2 rounded">✏️ Edit Prompt</button>
            <input
              type="datetime-local"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              className="text-black p-2 rounded"
            />
            <button onClick={schedulePost} className="bg-purple-600 text-white px-4 py-2 rounded">📅 Schedule Post</button>
          </div>
        </div>
      )}

      <h2 className="text-lg font-semibold mb-2 mt-8">📝 Drafts</h2>
      <section className="space-y-4 mb-8">
        {drafts.map((post) => (
          <div key={post.id} className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
            <p className="text-sm mb-2">{post.content}</p>
            {post.created_at && (
              <p className="text-xs text-zinc-500">Created: {new Date(post.created_at).toLocaleString()}</p>
            )}
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => {
                  setPrompt(post.content);
                  setOutput(post.content);
                  setEditingDraftId(post.id ?? null);
                }}
                className="text-sm bg-yellow-600 px-3 py-1 rounded text-white"
              >
                ✏️ Edit
              </button>
            </div>
          </div>
        ))}
      </section>

      <h2 className="text-lg font-semibold mb-2">📅 Scheduled Posts</h2>
      <section className="space-y-4">
        {scheduled.map((item, index) => (
          <div key={index} className="bg-zinc-800 p-4 rounded-xl border border-zinc-700">
            <p className="text-sm mb-2">{item.content}</p>
            <p className="text-xs text-zinc-400">Scheduled: {new Date(item.scheduled_at).toLocaleString()}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
