import "./globals.css";
import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import AuthProvider from "@/components/SessionProvider"; // ✅ NEW
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "PlanetSham Clean",
  description: "AI-powered blogging",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider> {/* ✅ Wrap all children */}
          <Navbar />
          <main className="p-4">{children}</main>
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  );
}
