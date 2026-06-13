import { DatabaseSync } from 'node:sqlite';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(import.meta.url), '../../../..');
const db = new DatabaseSync(join(ROOT, 'data/index.db'));

const args = process.argv.slice(2);
const get = (flag) => {
  const i = args.indexOf(flag);
  return i !== -1 ? args[i + 1] : null;
};

const date    = get('--date')    ?? new Date().toISOString().slice(0, 10);
const title   = get('--title')   ?? 'Untitled Session';
const summary = get('--summary') ?? '';
const result  = get('--result')  ?? '✅';
const files   = get('--files')   ?? null;

const insert = db.prepare(`
  INSERT INTO sessions (date, title, summary, files_touched, result)
  VALUES (?, ?, ?, ?, ?)
`);

insert.run(date, title, summary, files, result);
console.log(`✅ Session logged: [${date}] ${title}`);
