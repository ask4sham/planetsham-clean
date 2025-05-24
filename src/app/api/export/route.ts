import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const scheduledPath = path.join(process.cwd(), "src", "data", "scheduled-posts.json");
const publishedPath = path.join(process.cwd(), "src", "data", "published-posts.json");

function toCSV(posts: any[]) {
  const header = "content,scheduledAt,tags";
  const rows = posts.map((p) =>
    `"${(p.content || "").replace(/"/g, '""')}","${p.scheduledAt || ""}","${(p.tags || []).join(" | ")}"`
  );
  return [header, ...rows].join("\n");
}

export async function GET() {
  try {
    const [scheduledData, publishedData] = await Promise.all([
      fs.readFile(scheduledPath, "utf-8"),
      fs.readFile(publishedPath, "utf-8"),
    ]);

    const scheduled = JSON.parse(scheduledData);
    const published = JSON.parse(publishedData);

    const csv = toCSV([...scheduled, ...published]);

    return new NextResponse(csv, {
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
