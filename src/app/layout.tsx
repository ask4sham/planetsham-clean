import './globals.css';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import { Analytics } from '@vercel/analytics/react'; // ✅ Step 1: Import Analytics

export const metadata: Metadata = {
  title: 'PlanetSham Clean',
  description: 'Fresh start with blog',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="p-4">{children}</main>
        <Analytics /> {/* ✅ Step 2: Add Analytics at bottom of <body> */}
      </body>
    </html>
  );
}
