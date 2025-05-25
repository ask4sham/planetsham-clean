import './globals.css';
import type { Metadata } from 'next';
import Navbar from '../components/Navbar';
import { Analytics } from '@vercel/analytics/react';
import SupabaseProvider from '../components/SupabaseProvider'; // ✅ New wrapper

export const metadata: Metadata = {
  title: 'PlanetSham Clean',
  description: 'Fresh start with blog',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SupabaseProvider>
          <Navbar />
          <main className="p-4">{children}</main>
          <Analytics />
        </SupabaseProvider>
      </body>
    </html>
  );
}
