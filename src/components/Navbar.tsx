import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white p-4">
      <ul className="flex space-x-4">
        <li>
          <Link href="/" className="hover:text-gray-400">
            Home
          </Link>
        </li>
        <li>
          <Link href="/blog" className="hover:text-gray-400">
            Blog
          </Link>
        </li>
        <li>
          <Link href="/dashboard/analytics" className="hover:text-gray-400">
            📊 Analytics
          </Link>
        </li>
      </ul>
    </nav>
  );
}
