"use client";

import { useEffect, useState } from "react";

type PostCardProps = {
  postId: string;
  content: string;
};

export function PostCard({ postId, content }: PostCardProps) {
  const [isBoosted, setIsBoosted] = useState(false);

  // ✅ Detect if this post is already boosted
  useEffect(() => {
    const checkBoost = async () => {
      const res = await fetch("/api/check-boost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({ postId }),
      });
      const result = await res.json();
      setIsBoosted(result.boosted);
    };
    checkBoost();
  }, [postId]);

  return (
    <div className="p-4 bg-zinc-900 text-white rounded-xl shadow-md mb-4">
      <p className="mb-2">{content}</p>

      {isBoosted ? (
        <button
          onClick={async () => {
            const res = await fetch("/api/unboost", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ postId }),
            });
            const result = await res.json();
            if (result.success) {
              console.log("🔁 Unboosted");
              setIsBoosted(false);
            }
          }}
          className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
        >
          ❌ Unboost
        </button>
      ) : (
        <button
          onClick={async () => {
            const res = await fetch("/api/boost", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ postId }),
            });
            const result = await res.json();
            if (result.success) {
              console.log("⚡ Boosted");
              setIsBoosted(true);
            }
          }}
          className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
        >
          ⚡ Boost Post
        </button>
      )}
    </div>
  );
}
