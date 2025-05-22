export default function Navbar() {
  return (
    <nav className="w-full bg-black text-white p-4">
      <ul className="flex gap-4">
        <li><a href="/">Home</a></li>
        <li><a href="/blog">Blog</a></li>
        <li><a href="/analytics">Analytics</a></li>
      </ul>
    </nav>
  );
}
