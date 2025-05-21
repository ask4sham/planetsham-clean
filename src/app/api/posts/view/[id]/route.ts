import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  console.log("Received POST for ID:", id);

  // Add your logic here, like saving a view count or analytics event

  return new Response(JSON.stringify({ message: `View recorded for ID: ${id}` }), {
    status: 200,
  });
}
