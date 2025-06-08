"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthStatus() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;

  return session ? (
    <div className="text-sm">
      Signed in as <strong>{session.user?.email}</strong>
      <button
        onClick={() => signOut()}
        className="ml-2 px-2 py-1 bg-red-600 rounded hover:bg-red-700 text-white text-xs"
      >
        Sign Out
      </button>
    </div>
  ) : (
    <button
      onClick={() => signIn("github")}
      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
    >
      Sign In with GitHub
    </button>
  );
}
