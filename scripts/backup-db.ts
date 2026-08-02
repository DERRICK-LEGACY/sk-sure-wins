import * as fs from 'fs';
import * as path from 'path';

const DB_FILE = path.join(process.cwd(), 'database.sqlite');
const BACKUP_DIR = path.join(process.cwd(), 'backups');
const MAX_BACKUPS = 7;

async function runBackup() {
  console.log('Starting database backup...');

  if (!fs.existsSync(DB_FILE)) {
    console.error(`Database file not found at ${DB_FILE}`);
    process.exit(1);
  }

  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  const dateStr = new Date().toISOString().split('T')[0];
  const backupFileName = `database-${dateStr}-${Date.now()}.sqlite`;
  const backupFilePath = path.join(BACKUP_DIR, backupFileName);

  try {
    fs.copyFileSync(DB_FILE, backupFilePath);
    console.log(`Successfully created backup: ${backupFileName}`);

    // Cleanup old backups
    const files = fs.readdirSync(BACKUP_DIR)
      .filter(f => f.startsWith('database-') && f.endsWith('.sqlite'))
      .map(f => ({ name: f, path: path.join(BACKUP_DIR, f), ctime: fs.statSync(path.join(BACKUP_DIR, f)).ctime }))
      .sort((a, b) => b.ctime.getTime() - a.ctime.getTime());

    if (files.length > MAX_BACKUPS) {
      const toDelete = files.slice(MAX_BACKUPS);
      for (const file of toDelete) {
        fs.unlinkSync(file.path);
        console.log(`Deleted old backup: ${file.name}`);
      }
    }
  } catch (err) {
    console.error('Failed to backup database:', err);
    process.exit(1);
  }
}

runBackup();
