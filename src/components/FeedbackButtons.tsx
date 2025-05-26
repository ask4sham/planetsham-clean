"use client";
import { useSession } from "next-auth/react";
import { refineModel } from "@/ai/feedback";

export function FeedbackButtons({ topic }: { topic: string }) {
  const { data: session } = useSession();

  const handleFeedback = async (type: "up" | "down") => {
    if (!session?.user?.id) return;
    await refineModel(session.user.id, topic, type);
  };

  return (
    <div className="flex gap-2 mt-2">
      <button onClick={() => handleFeedback("up")} className="text-green-500">
        👍 Helpful
      </button>
      <button onClick={() => handleFeedback("down")} className="text-red-500">
        👎 Not Relevant
      </button>
    </div>
  );
}
