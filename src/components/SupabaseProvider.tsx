"use client";

import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useState, ReactNode } from "react";
import { Database } from "@/types/supabase"; // only if you're using custom types

interface Props {
  children: ReactNode;
}

export default function SupabaseProvider({ children }: Props) {
  const [supabaseClient] = useState(() =>
    createBrowserSupabaseClient<Database>() // or remove <Database> if not using types
  );

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      {children}
    </SessionContextProvider>
  );
}
