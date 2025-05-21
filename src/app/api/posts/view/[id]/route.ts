import { NextRequest } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  console.log("Received POST for ID:", id);

  // Add your logic here, like saving a view count or analytics event

  return new Response(JSON.stringify({ message: `View recorded for ID: ${id}` }), {
    status: 200,
  });
}
