"use client";

import { useSearchParams } from "next/navigation";

export default function BoostStatusPage() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");

  return (
    <div className="p-6 max-w-xl mx-auto text-center">
      {status === "success" ? (
        <div className="text-green-500 font-semibold text-lg">
          🎉 Boost successful! Your post will be promoted.
        </div>
      ) : (
        <div className="text-red-500 font-semibold text-lg">
          ❌ Boost canceled or failed. No charge was made.
        </div>
      )}
    </div>
  );
}
