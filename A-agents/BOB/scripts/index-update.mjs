import { DatabaseSync } from 'node:sqlite';
import { readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(import.meta.url), '../../../..');
const db = new DatabaseSync(join(ROOT, 'data/index.db'));

const SCAN_DIRS = [
  { dir: 'C-core',             category: 'Core' },
  { dir: 'B-brain',            category: 'Brain' },
  { dir: 'A-agents',           category: 'Agents' },
  { dir: 'O-output',           category: 'Output' },
  { dir: 'M-memory',           category: 'Memory' },
  { dir: 'docs',               category: 'Docs' },
  { dir: 'dev',                category: 'Dev' },
  { dir: 'screenshots',        category: 'Screenshots' },
  { dir: 'app/src/pages',      category: 'page' },
  { dir: 'app/src/components', category: 'component' },
  { dir: 'app/src/hooks',      category: 'hook' },
  { dir: 'app/src/lib',        category: 'lib' },
];

function walkDir(dir, fileList = []) {
  let entries;
  try { entries = readdirSync(dir); } catch { return fileList; }
  for (const entry of entries) {
    const full = join(dir, entry);
    try {
      const stat = statSync(full);
      if (stat.isDirectory()) walkDir(full, fileList);
      else if (!entry.startsWith('.') && !entry.endsWith('.gitkeep')) fileList.push(full);
    } catch { /* skip */ }
  }
  return fileList;
}

const upsert = db.prepare(`
  INSERT INTO files (path, category, updated)
  VALUES (?, ?, ?)
  ON CONFLICT(path) DO UPDATE SET category=excluded.category, updated=excluded.updated
`);

let added = 0;
const today = new Date().toISOString().slice(0, 10);

for (const { dir, category } of SCAN_DIRS) {
  const absDir = join(ROOT, dir);
  const files = walkDir(absDir);
  for (const f of files) {
    const relPath = relative(ROOT, f).replaceAll('\\', '/');
    upsert.run(relPath, category, today);
    added++;
  }
}

console.log(`✅ index-update: ${added} files indexed`);
