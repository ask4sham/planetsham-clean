"use client";

import Link from "next/link";
import AuthStatus from "./AuthStatus"; // ✅ Component for sign in/out

export default function Navbar() {
  return (
    <nav className="w-full bg-black text-white p-4 flex justify-between items-center">
      <ul className="flex gap-4">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/blog">Blog</Link></li>
        <li><Link href="/analytics">Analytics</Link></li>
        <li><Link href="/leaderboard">Leaderboard</Link></li>
      </ul>
      <AuthStatus /> {/* ✅ Show login/logout button */}
    </nav>
  );
}
