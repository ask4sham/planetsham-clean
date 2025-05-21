// src/app/blog/metadata.ts
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PlanetSham Blog – AI-Generated News & Insights",
  description: "Explore the latest AI-generated posts on news, trends, and insights from PlanetSham.",
  metadataBase: new URL("https://planetsham.com"),
  alternates: {
    canonical: "/blog",
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
  },
  openGraph: {
    title: "PlanetSham Blog",
    description: "Fresh AI-generated articles on society, technology, and the world.",
    url: "https://planetsham.com/blog",
    siteName: "PlanetSham",
    images: [
      {
        url: "https://planetsham.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "PlanetSham AI Blog",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PlanetSham Blog",
    description: "Curated content and insights from our AI publishing engine.",
    images: ["https://planetsham.com/og-image.png"],
  },
};
