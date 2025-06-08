"use client";

import { useEffect, useState } from "react";

export default function LogsDashboard() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    // Load existing browser fallback logs from localStorage
    const localLogs = localStorage.getItem("clientLogs");
    if (localLogs) {
      setLogs(JSON.parse(localLogs));
    }
  }, []);

  return (
    <main className="p-6 max-w-4xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-6">📂 Local Log Viewer</h1>

      {logs.length === 0 ? (
        <p className="text-zinc-400">No browser logs found. (Only client logs shown here)</p>
      ) : (
        <ul className="space-y-4">
          {logs.map((entry, idx) => (
            <li key={idx} className="bg-zinc-900 p-4 rounded-lg border border-zinc-700">
              <p className="text-sm text-zinc-400 mb-2">🕒 {entry.timestamp}</p>
              <pre className="text-xs whitespace-pre-wrap break-words">
                {JSON.stringify(entry.data, null, 2)}
              </pre>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
