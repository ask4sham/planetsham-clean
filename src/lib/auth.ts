// src/lib/auth.ts
import { supabase } from "@/lib/supabaseClient"; // adjust this import path as needed
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions"; // your NextAuth config

export async function getUserInterests() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return ["tech", "finance"]; // fallback defaults

  const { data, error } = await supabase
    .from("profiles")
    .select("interests")
    .eq("id", session.user.id)
    .single();

  if (error || !data) return ["tech", "finance"]; // fail-safe
  return data.interests || ["tech", "finance"];
}
