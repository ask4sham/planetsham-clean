import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-black text-white p-4">
      <ul className="flex gap-4">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/blog">Blog</Link></li>
        <li><Link href="/analytics">Analytics</Link></li>
      </ul>
    </nav>
  );
}
