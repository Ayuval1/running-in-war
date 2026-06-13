import { DatabaseSync } from 'node:sqlite';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(import.meta.url), '../../../..');
const db = new DatabaseSync(join(ROOT, 'data/index.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS files (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    path      TEXT UNIQUE NOT NULL,
    category  TEXT,
    title     TEXT,
    summary   TEXT,
    tags      TEXT,
    updated   TEXT
  );

  CREATE TABLE IF NOT EXISTS links (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    from_path TEXT NOT NULL,
    to_path   TEXT NOT NULL,
    rel_type  TEXT
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    date          TEXT NOT NULL,
    title         TEXT,
    summary       TEXT,
    files_touched TEXT,
    result        TEXT
  );
`);

const insertFile = db.prepare(`
  INSERT OR IGNORE INTO files (path, category, title, updated)
  VALUES (?, ?, ?, ?)
`);

const seedFiles = [
  ['C-core/core-identity.md',                       'Core',    'זהות המוצר'],
  ['B-brain/product.md',                            'Brain',   'מסמך מוצר'],
  ['B-brain/index.md',                              'Brain',   'Brain Index'],
  ['CLAUDE.md',                                     'Technical','Project Navigator'],
  ['A-agents/BOB/BOB.md',                          'Agents',  'BOB Agent Profile'],
  ['.claude/skills/brand-guidelines/SKILL.md',      'Skill',   'Brand Guidelines'],
];

for (const [path, category, title] of seedFiles) {
  insertFile.run(path, category, title, '2026-06-13');
}

const insertSession = db.prepare(`
  INSERT OR IGNORE INTO sessions (date, title, result)
  VALUES (?, ?, ?)
`);

const seedSessions = [
  ['2026-05-19', 'Route Point Markers + fitBounds',    '✅'],
  ['2026-05-23', 'City Filter + 159 מקלטים',           '✅'],
  ['2026-05-26', 'Brand Guidelines Skill',              '✅'],
  ['2026-06-05', 'Auth Logo Proportions',               '✅'],
  ['2026-06-13', 'ABC-TOM Restructure + BOB',           '✅'],
];

for (const [date, title, result] of seedSessions) {
  insertSession.run(date, title, result);
}

console.log('✅ DB initialized: 3 tables, seed data inserted');
