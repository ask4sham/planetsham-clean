"use client";

import { useEffect, useState } from "react";

type Insight = {
  id: number;
  category: "News" | "Finance" | "Health" | "Social";
  headline: string;
  summary: string;
};

const mockInsights: Insight[] = [
  {
    id: 1,
    category: "News",
    headline: "Global Inflation Slows",
    summary: "AI summary: Inflation dropped to 3.2% in major economies, signaling easing interest rates.",
  },
  {
    id: 2,
    category: "Finance",
    headline: "Tesla Shares Slide 5%",
    summary: "AI insight: Your portfolio may be impacted. Consider rebalancing tech-heavy assets.",
  },
  {
    id: 3,
    category: "Health",
    headline: "Apple Watch Adds Blood Sugar Monitoring",
    summary: "AI note: If you track glucose, this could simplify your daily routine.",
  },
];

const categoryEmoji = {
  News: "📰",
  Finance: "💰",
  Health: "🩺",
  Social: "🌐",
};

export default function AIContextBlock() {
  const [insights, setInsights] = useState<Insight[]>([]);

  useEffect(() => {
    // Simulate async fetch (replace with real API later)
    setTimeout(() => setInsights(mockInsights), 500);
  }, []);

  return (
    <div className="mt-6 p-4 bg-zinc-800 text-white rounded-2xl shadow-md">
      <h2 className="text-xl font-bold mb-4">🔍 AI Context Engine</h2>
      {insights.map((insight) => (
        <div
          key={insight.id}
          className="mb-4 border-b border-zinc-700 pb-3 last:border-none"
        >
          <div className="flex items-center gap-2 mb-1">
            <span>{categoryEmoji[insight.category]}</span>
            <h3 className="font-semibold">{insight.headline}</h3>
          </div>
          <p className="text-sm text-zinc-300">{insight.summary}</p>
        </div>
      ))}
    </div>
  );
}
