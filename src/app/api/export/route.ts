import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    // ✅ Updated to project root path (not public/)
    const filePath = path.join(process.cwd(), "blog.json");

    if (!fs.existsSync(filePath)) {
      return new NextResponse("No published posts found", { status: 404 });
    }

    const raw = fs.readFileSync(filePath, "utf-8");
    const posts = JSON.parse(raw);

    const csv = [
      "content,scheduledAt",
      ...posts.map((p: any) =>
        `"${(p.content || "").replace(/"/g, '""')}","${p.scheduledAt || ""}"`
      ),
    ].join("\n");

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=planetsham-posts.csv",
      },
    });
  } catch (error) {
    console.error("❌ Failed to export:", error);
    return new NextResponse("Export error", { status: 500 });
  }
}
