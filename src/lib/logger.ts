// /src/lib/logger.ts
import path from 'path';

type FSType = typeof import('fs/promises');
let fs: FSType | null = null;
if (typeof window === 'undefined') {
  fs = await import('fs/promises');
}

const BACKUP_DIR = path.join(process.cwd(), 'src', 'localBackups');

export const logger = {
  async backup(data: unknown, prefix = 'backup') {
    if (!fs || typeof window !== 'undefined') {
      console.warn('[Logger] Browser fallback → localStorage');
      const logs = JSON.parse(localStorage.getItem('clientLogs') || '[]');
      logs.push({ timestamp: new Date().toISOString(), data });
      localStorage.setItem('clientLogs', JSON.stringify(logs));
      return;
    }

    try {
      await fs.mkdir(BACKUP_DIR, { recursive: true });
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `${prefix}_${timestamp}.json`;
      const filePath = path.join(BACKUP_DIR, filename);

      await fs.writeFile(filePath, JSON.stringify({
        timestamp: new Date().toISOString(),
        data
      }, null, 2));

      // ✅ Log rotation: Keep only latest 100 files
      const files = (await fs.readdir(BACKUP_DIR)).sort();
      if (files.length > 100) {
        const excess = files.slice(0, files.length - 100);
        await Promise.all(excess.map(file => fs!.unlink(path.join(BACKUP_DIR, file))));
      }
    } catch (error) {
      console.error('[Logger] Failed to write or clean backups:', error);
    }
  }
};
