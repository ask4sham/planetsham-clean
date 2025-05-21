import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Read from blog.json inside /public
const blogFilePath = path.join(process.cwd(), "public", "blog.json");

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  try {
    if (!fs.existsSync(blogFilePath)) {
      return new NextResponse("No published posts found", { status: 404 });
    }

    const raw = fs.readFileSync(blogFilePath, "utf-8");
    const posts = JSON.parse(raw);

    if (!Array.isArray(posts) || posts.length === 0) {
      return new NextResponse("No published posts found", { status: 404 });
    }

    const rssItems = posts
      .map(
        (post: any, i: number) => `
        <item>
          <title>${escapeXml(post.content.slice(0, 50))}</title>
          <description>${escapeXml(post.content)}</description>
          <pubDate>${new Date(post.scheduledAt || Date.now()).toUTCString()}</pubDate>
          <guid>planetsham-${i}</guid>
        </item>`
      )
      .join("");

    const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>PlanetSham Posts</title>
    <link>https://planetsham.com</link>
    <description>AI-generated blog posts from PlanetSham</description>
    ${rssItems}
  </channel>
</rss>`.trim();

    return new NextResponse(rssFeed, {
      status: 200,
      headers: { "Content-Type": "application/rss+xml" },
    });

  } catch (err) {
    console.error("❌ Error generating RSS feed:", err);
    return new NextResponse("Failed to generate RSS feed", { status: 500 });
  }
}
