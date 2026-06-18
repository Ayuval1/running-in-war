import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const TEXT_EXTS = new Set(['.md', '.mjs', '.js', '.ts', '.tsx']);

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildEntityRegistry(allFiles) {
  const registry = new Map(); // entityName → filePath

  for (const filePath of allFiles) {
    const parts = filePath.split('/');
    const filename = parts[parts.length - 1];
    const nameNoExt = filename.replace(/\.md$/, '');

    if (nameNoExt === 'index' || nameNoExt === 'README' || nameNoExt === 'SKILL') continue;

    // SKILL.md → שם ישות = תיקיית האב
    if (filename === 'SKILL.md' && parts.length >= 2) {
      const parentFolder = parts[parts.length - 2];
      if (!registry.has(parentFolder)) registry.set(parentFolder, filePath);
      continue;
    }

    if (filename.endsWith('.md')) {
      if (!registry.has(nameNoExt)) registry.set(nameNoExt, filePath);
    }
  }

  return registry;
}

export function updateLinks(db, ROOT) {
  const allFiles = db.prepare('SELECT path FROM files').all().map(r => r.path);
  const entityRegistry = buildEntityRegistry(allFiles);

  db.exec('DELETE FROM links');

  const insert = db.prepare(
    'INSERT OR IGNORE INTO links (from_path, to_path, rel_type) VALUES (?, ?, ?)'
  );

  const linkTuples = [];

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
        linkTuples.push([fromPath, toPath, 'mentions']);
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
        linkTuples.push([fromPath, toPath, 'imports']);
      }
    }

    // wiki_mention — זיהוי שמות קצרים
    const sortedEntities = [...entityRegistry.entries()].sort((a, b) => b[0].length - a[0].length);
    for (const [entityName, toPath] of sortedEntities) {
      if (toPath === fromPath) continue;
      const isCaps = /^[A-Z][A-Z0-9\-]*$/.test(entityName);
      const escaped = escapeRegex(entityName);
      const flags = isCaps ? 'g' : 'gi';
      const regex = new RegExp(`(?<![\\w-])${escaped}(?![\\w-])`, flags);
      if (regex.test(content)) {
        linkTuples.push([fromPath, toPath, 'wiki_mention']);
      }
    }
  }

  // Batch inserts for performance
  for (const [from, to, rel] of linkTuples) {
    insert.run(from, to, rel);
  }

  console.log(`✅ link-update: ${linkTuples.length} links built`);
  return linkTuples.length;
}
