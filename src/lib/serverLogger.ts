import fs from "fs";
import path from "path";
import { gzipSync } from "zlib";

const BACKUP_DIR = path.join(process.cwd(), "src", "localBackups");

if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

export const serverLogger = {
  backup: (data: any, prefix = "backup") => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `${prefix}_${timestamp}.json.gz`;
    const filePath = path.join(BACKUP_DIR, filename);
    const compressed = gzipSync(JSON.stringify(data, null, 2));
    fs.writeFileSync(filePath, compressed);
  },
};
