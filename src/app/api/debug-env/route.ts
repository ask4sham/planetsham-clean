// /src/app/api/debug-env/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    GITHUB_ID: process.env.GITHUB_ID || "❌ Missing",
    HELLO_TEST: process.env.HELLO_TEST || "❌ Missing",
  });
}
