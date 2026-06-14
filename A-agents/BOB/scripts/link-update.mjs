import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const TEXT_EXTS = new Set(['.md', '.mjs', '.js', '.ts', '.tsx']);

export function updateLinks(db, ROOT) {
  const allFiles = db.prepare('SELECT path FROM files').all().map(r => r.path);

  db.exec('DELETE FROM links');

  const insert = db.prepare(
    'INSERT OR IGNORE INTO links (from_path, to_path, rel_type) VALUES (?, ?, ?)'
  );

  let count = 0;

  for (const fromPath of allFiles) {
    const dotIdx = fromPath.lastIndexOf('.');
    const ext = dotIdx >= 0 ? fromPath.slice(dotIdx) : '';
    if (!TEXT_EXTS.has(ext)) continue;

    let content;
    try {
      content = readFileSync(join(ROOT, fromPath), 'utf8');
    } catch {
      continue;
    }

    for (const toPath of allFiles) {
      if (toPath === fromPath) continue;

      // mentions: path string appears literally in content
      if (content.includes(toPath)) {
        insert.run(fromPath, toPath, 'mentions');
        count++;
        continue;
      }

      // imports: relative import by filename
      const filename = toPath.split('/').pop() ?? '';
      if (
        filename &&
        (content.includes(`'${filename}'`) ||
          content.includes(`"${filename}"`) ||
          content.includes(`'./${filename}'`) ||
          content.includes(`"./${filename}"`))
      ) {
        insert.run(fromPath, toPath, 'imports');
        count++;
      }
    }
  }

  console.log(`✅ link-update: ${count} links built`);
  return count;
}
