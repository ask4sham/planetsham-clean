import { NextResponse } from "next/server";

export async function GET() {
  const mockPosts = [
    {
      id: 1,
      type: "text",
      content: "🌍 PlanetSham is live — where AI and culture collide.",
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      type: "image",
      content: "https://source.unsplash.com/random/800x400?nature,ai",
      createdAt: new Date().toISOString(),
    },
    {
      id: 3,
      type: "poll",
      content: "🤖 Do you trust AI to summarize your news?\n- Yes\n- No\n- Maybe",
      createdAt: new Date().toISOString(),
    },
  ];

  return NextResponse.json(mockPosts);
}
