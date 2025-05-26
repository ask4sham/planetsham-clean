"use client";
export function BoostButton({ postId }: { postId: string }) {
  const handleClick = async () => {
    const res = await fetch("/api/boost", {
      method: "POST",
      body: JSON.stringify({ postId }),
    });
    const { url } = await res.json();
    window.location.href = url;
  };

  return (
    <button onClick={handleClick} className="bg-yellow-500 text-white px-4 py-2 rounded">
      🚀 Boost Post
    </button>
  );
}
