import { DatabaseSync } from 'node:sqlite';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(import.meta.url), '../../../..');
const db = new DatabaseSync(join(ROOT, 'data/index.db'));

console.log('📝 BOB: Updating DB with new skills, tools, and links...\n');

// 1. Add new skill files
const insertFile = db.prepare(`
  INSERT OR REPLACE INTO files (path, category, title, summary, updated)
  VALUES (?, ?, ?, ?, ?)
`);

const newFiles = [
  ['.claude/skills/write-to-learning-log/SKILL.md', 'Skill', 'write-to-learning-log', 'BOB כותב Iteration Log לפורמט Tom Even. בדיקת כפילויות. טוען בסוף שיחה.', '2026-06-15'],
  ['.claude/skills/deploy/SKILL.md', 'Skill', 'deploy', 'Deploy RunningInWar ל-Vercel. תמיד מ-app/. cd app && vercel --prod.', '2026-06-15'],
  ['T-tools/', 'Folder', 'T-tools Registry', 'Project Skills Registry — index.md + per-skill summaries. אנלוגי ל-A-agents אבל לסקילים.', '2026-06-15'],
];

console.log('✅ Adding new files/folders to catalog:');
for (const [path, category, title, summary, updated] of newFiles) {
  insertFile.run(path, category, title, summary, updated);
  console.log(`   • ${title} → ${path}`);
}

// 2. Add links for MOTI → research-analyst
const insertLink = db.prepare(`
  INSERT OR REPLACE INTO links (from_path, to_path, rel_type)
  VALUES (?, ?, ?)
`);

const newLinks = [
  ['A-agents/MOTI/MOTI.md', 'C:\\Users\\user\\.claude\\skills\\research-analyst\\SKILL.md', 'uses_skill'],
];

console.log('\n✅ Adding agent-skill links:');
for (const [from, to, relType] of newLinks) {
  insertLink.run(from, to, relType);
  console.log(`   • MOTI → research-analyst (${relType})`);
}

// 3. Verify insertions
console.log('\n📊 Verification:');
const filesCount = db.prepare('SELECT COUNT(*) as count FROM files').get();
const linksCount = db.prepare('SELECT COUNT(*) as count FROM links').get();

console.log(`   Files in DB: ${filesCount.count}`);
console.log(`   Links in DB: ${linksCount.count}`);

// Show new entries
console.log('\n🆕 New files added:');
const newFileEntries = db.prepare(`
  SELECT id, path, category, title FROM files
  WHERE updated = '2026-06-15'
  ORDER BY id DESC
`).all();

newFileEntries.forEach(f => {
  console.log(`   [${f.id}] ${f.category}: ${f.title}`);
});

console.log('\n✨ DB update complete!');
