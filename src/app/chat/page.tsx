"use client";

import { useState } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setLoading(true);
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.output }]);
    } catch (error) {
      setMessages([...newMessages, { role: "assistant", content: "❌ Error talking to AI." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 max-w-2xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-4">🧠 AI Messaging Assistant</h1>
      <div className="bg-zinc-900 rounded-xl p-4 h-[500px] overflow-y-auto mb-4 border border-zinc-700">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 text-sm ${
              msg.role === "user" ? "text-right text-blue-400" : "text-left text-green-400"
            }`}
          >
            {msg.content}
          </div>
        ))}
        {loading && (
          <div className="text-left text-zinc-500 animate-pulse">AI is thinking...</div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 p-2 rounded bg-zinc-800 text-white"
          placeholder="Ask your assistant..."
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </main>
  );
}
