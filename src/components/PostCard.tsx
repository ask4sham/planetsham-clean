{isBoosted ? (
  <button
    onClick={async () => {
      const res = await fetch("/api/unboost", {
        method: "POST",
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
