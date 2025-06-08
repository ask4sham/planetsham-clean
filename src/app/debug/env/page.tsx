// /src/app/debug/env/page.tsx
"use client";

export default function EnvDebugPage() {
  return (
    <div style={{ padding: "2rem", fontFamily: "monospace" }}>
      <h2>🔍 Debug Environment</h2>
      <pre>{JSON.stringify(process.env, null, 2)}</pre>
    </div>
  );
}
