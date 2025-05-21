export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white p-4">
      <ul className="flex space-x-4">
        <li>
          <a href="/" className="hover:text-gray-400">Home</a>
        </li>
        <li>
          <a href="/blog" className="hover:text-gray-400">Blog</a>
        </li>
        <li>
          <a href="/dashboard/analytics" className="hover:text-gray-400">📊 Analytics</a>
        </li>
      </ul>
    </nav>
  );
}
