// src/ai/feedback.ts
import { supabase } from "@/lib/supabaseClient";

export async function refineModel(userId: string, topic: string, feedback: "up" | "down") {
  const { data } = await supabase
    .from("user_weights")
    .select("*")
    .eq("user_id", userId)
    .single();

  const currentWeight = data?.[topic] || 1;
  const newWeight = feedback === "up" ? currentWeight * 1.1 : currentWeight * 0.9;

  await supabase
    .from("user_weights")
    .update({ [topic]: newWeight })
    .eq("user_id", userId);
}
