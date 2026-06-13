import { DatabaseSync } from 'node:sqlite';
import { watch } from 'node:fs';
import { join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(import.meta.url), '../../../..');
const INBOX = join(ROOT, "O-output/Team Output");
const db = new DatabaseSync(join(ROOT, 'data/index.db'));

const upsert = db.prepare(`
  INSERT INTO files (path, category, updated)
  VALUES (?, 'TeamOutput', ?)
  ON CONFLICT(path) DO UPDATE SET category='TeamOutput', updated=excluded.updated
`);

console.log(`👀 Watching O-output/Team Output/ for new files...`);

watch(INBOX, { persistent: true }, (eventType, filename) => {
  if (!filename || filename.startsWith('.')) return;
  const relPath = `O-output/Team Output/${filename}`;
  const today = new Date().toISOString().slice(0, 10);
  upsert.run(relPath, today);
  console.log(`📥 New file indexed: ${filename}`);
});
