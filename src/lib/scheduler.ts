import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "scheduled-posts.json");

export function getScheduledPosts() {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const all = JSON.parse(raw);
    const now = new Date().toISOString();

    const ready = all.filter((p: any) => p.scheduledAt <= now);
    const future = all.filter((p: any) => p.scheduledAt > now);

    return { ready, future };
  } catch (err) {
    console.error("Scheduler read failed:", err);
    return { ready: [], future: [] };
  }
}

export function updateScheduledPosts(posts: any[]) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(posts, null, 2));
  } catch (err) {
    console.error("Scheduler write failed:", err);
  }
}
