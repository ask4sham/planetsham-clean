// /src/lib/backupValidator.ts

import fs from 'fs/promises';
import path from 'path';

const BACKUP_DIR = path.join(process.cwd(), 'src', 'localBackups');

interface Backup {
  content: string;
  metadata: {
    timestamp: string;
    version?: number;
  };
}

export async function validateBackup(filename: string): Promise<Backup> {
  const filePath = path.join(BACKUP_DIR, filename);

  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    const json = JSON.parse(raw);

    console.log(`📦 Inspecting backup file: ${filename}`);
    console.log('🔑 Top-level keys:', Object.keys(json));

    let content = json.content || json.data?.content;
    if (typeof content === 'object' && content.output) {
      content = content.output;
    }

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      throw new Error(`Invalid content in backup file: ${filename}`);
    }

    return {
      content,
      metadata: {
        timestamp: json.timestamp || json.data?.timestamp || new Date().toISOString(),
        version: json.version || 1,
      },
    };
  } catch (err) {
    const rawContents = await fs.readFile(filePath, 'utf-8');
    console.error(`\n⚠️ Failed to validate backup (${filename}). Raw contents:\n${rawContents}\n`);
    throw err;
  }
}
