'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { supabase } from '@/lib/supabaseClient';

export default function DashboardPage() {
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState<'gpt-4' | 'mistral-7b'>('gpt-4');
  const [output, setOutput] = useState('');
  const [tokensUsed, setTokensUsed] = useState(0);
  const [cost, setCost] = useState(0);
  const [scheduledDate, setScheduledDate] = useState('');

  const handleGenerate = async () => {
    if (model === 'mistral-7b') return;

    const res = await fetch('/api/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt, model }),
    });

    const data = await res.json();
    setOutput(data.output || '[No response]');
    setTokensUsed(data.tokens || 0);
    setCost(data.cost || 0);
  };

  const handleSave = async () => {
    if (!output || output.trim() === '') {
      alert('⚠️ No output to save.');
      return;
    }

    const { error } = await supabase.from('generated_posts').insert([
      {
        content: output,
        prompt,
        model_used: model,
        token_count: tokensUsed,
      },
    ]);

    if (error) {
      console.error('❌ Save draft error:', error);
      alert('❌ Failed to save draft.');
    } else {
      alert('✅ Draft saved!');
    }
  };

  const handleSchedule = async () => {
    if (!scheduledDate) {
      alert("⚠️ Please pick a date and time.");
      return;
    }

    try {
      const isoDate = new Date(scheduledDate).toISOString();

      const { error } = await supabase.from('scheduled_posts').insert([
        {
          content: output,
          prompt,
          model_used: model,
          scheduled_at: isoDate,
        },
      ]);

      if (error) {
        console.error("❌ Schedule error:", error);
        alert(`❌ Failed to schedule post: ${error.message || 'Unknown error'}`);
      } else {
        alert("📅 Post scheduled!");
      }
    } catch (err) {
      console.error("❌ Invalid date format:", err);
      alert("❌ Invalid date format.");
    }
  };

  return (
    <main className="p-6 max-w-4xl mx-auto text-white">
      <div className="mb-4 flex justify-between items-center">
        <span className="text-2xl font-semibold">📊 Dashboard</span>
      </div>

      <div className="mb-4">
        <select
          className="bg-black text-white border p-2 rounded"
          value={model}
          onChange={(e) => setModel(e.target.value as any)}
        >
          <option value="gpt-4">GPT-4</option>
          <option value="mistral-7b">Mistral 7B</option>
        </select>
      </div>

      <input
        className="w-full mb-4 p-2 bg-zinc-800 border border-zinc-700 rounded"
        placeholder="What do you want to generate?"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <div className="flex gap-4 mb-4">
        <button
          className="bg-blue-600 px-4 py-2 rounded text-white disabled:opacity-50"
          onClick={handleGenerate}
          disabled={model === 'mistral-7b'}
          title={model === 'mistral-7b' ? 'Mistral-7B support coming next week!' : ''}
        >
          Generate Post
        </button>
        <button
          className="bg-gray-600 px-4 py-2 rounded text-white"
          onClick={() => {
            setPrompt('');
            setOutput('');
            setTokensUsed(0);
            setCost(0);
          }}
        >
          🔄 Reset
        </button>
      </div>

      <p className="text-sm text-zinc-400 mb-2">
        🪙 Tokens used: {tokensUsed} <br />
        💰 Estimated cost: <strong>${cost.toFixed(6)}</strong>
      </p>

      <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-700">
        <h2 className="text-lg font-semibold mb-2">💬 AI Output</h2>
        <p className="mb-4 whitespace-pre-wrap">{output || '[No response]'}</p>

        <div className="flex flex-wrap gap-4 items-center">
          <button
            className="bg-green-700 px-4 py-2 rounded text-white"
            onClick={handleSave}
          >
            💾 Save as Draft
          </button>
          <button
            className="bg-yellow-600 px-4 py-2 rounded text-white"
            onClick={() => setPrompt(output)}
          >
            ✏️ Edit Prompt
          </button>
          <input
            type="datetime-local"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            className="bg-zinc-800 text-white border p-2 rounded"
          />
          <button
            className="bg-purple-600 px-4 py-2 rounded text-white"
            onClick={handleSchedule}
          >
            📅 Schedule Post
          </button>
        </div>
      </div>
    </main>
  );
}
