import { readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';
import { readdirSync, statSync } from 'node:fs';

const ROOT = join(fileURLToPath(import.meta.url), '../../../..');
const db = new DatabaseSync(join(ROOT, 'data/index.db'));

const SAFE_DIRS = ['A-agents', 'T-tools', 'M-memory', 'C-core'];
const applyMode = process.argv.includes('--apply');
const dirArgIdx = process.argv.indexOf('--dir');
const targetDirArg = dirArgIdx !== -1 ? process.argv[dirArgIdx + 1] : null;
const targetDirs = targetDirArg ? [targetDirArg] : SAFE_DIRS;

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildEntityRegistry(allFiles) {
  const registry = new Map();
  for (const filePath of allFiles) {
    const parts = filePath.split('/');
    const filename = parts[parts.length - 1];
    const nameNoExt = filename.replace(/\.md$/, '');
    if (nameNoExt === 'index' || nameNoExt === 'README' || nameNoExt === 'SKILL') continue;
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

function walkMdFiles(dir, fileList = []) {
  let entries;
  try { entries = readdirSync(dir); } catch { return fileList; }
  for (const entry of entries) {
    if (entry.startsWith('.')) continue;
    const full = join(dir, entry);
    try {
      const stat = statSync(full);
      if (stat.isDirectory()) walkMdFiles(full, fileList);
      else if (entry.endsWith('.md')) fileList.push(full);
    } catch {}
  }
  return fileList;
}

function stripFrontmatter(content) {
  const match = content.match(/^---\n[\s\S]*?\n---\n/);
  return match
    ? { frontmatter: match[0], body: content.slice(match[0].length) }
    : { frontmatter: '', body: content };
}

function wrapEntities(body, entityRegistry, selfName) {
  // מפצל לפי code fences ו-[[...]] כדי לא לגעת בהם
  const parts = [];
  let lastIdx = 0;
  // Regex: code fences OR already-linked [[...]]
  const skipRegex = /(```[\s\S]*?```|\[\[.*?\]\])/g;
  let m;
  while ((m = skipRegex.exec(body)) !== null) {
    parts.push({ type: 'text', content: body.slice(lastIdx, m.index) });
    parts.push({ type: 'skip', content: m[0] });
    lastIdx = m.index + m[0].length;
  }
  parts.push({ type: 'text', content: body.slice(lastIdx) });

  const sortedEntities = [...entityRegistry.keys()].sort((a, b) => b.length - a.length);

  return parts.map(part => {
    if (part.type === 'skip') return part.content;
    let text = part.content;
    for (const name of sortedEntities) {
      if (name === selfName) continue;
      const isCaps = /^[A-Z][A-Z0-9\-]*$/.test(name);
      const escaped = escapeRegex(name);
      const regex = new RegExp(`(?<![\\w-])${escaped}(?![\\w-])`, isCaps ? 'g' : 'gi');
      text = text.replace(regex, `[[${name}]]`);
    }
    return text;
  }).join('');
}

const allFiles = db.prepare('SELECT path FROM files').all().map(r => r.path);
const entityRegistry = buildEntityRegistry(allFiles);

const changes = [];

for (const dirName of targetDirs) {
  if (!SAFE_DIRS.includes(dirName)) { console.warn(`SKIP: ${dirName} not safe`); continue; }
  const absDir = join(ROOT, dirName);
  for (const absPath of walkMdFiles(absDir)) {
    const relPath = relative(ROOT, absPath).replaceAll('\\', '/');
    let original;
    try { original = readFileSync(absPath, 'utf8'); } catch { continue; }

    const parts = absPath.split(/[/\\]/);
    const filename = parts[parts.length - 1];
    const selfName = filename === 'SKILL.md' ? parts[parts.length - 2] : filename.replace(/\.md$/, '');

    const { frontmatter, body } = stripFrontmatter(original);
    const newBody = wrapEntities(body, entityRegistry, selfName);
    const newContent = frontmatter + newBody;

    if (newContent !== original) {
      changes.push({ relPath, original, newContent });
      if (applyMode) {
        writeFileSync(absPath, newContent, 'utf8');
        console.log(`WROTE: ${relPath}`);
      } else {
        console.log(`WOULD CHANGE: ${relPath}`);
      }
    }
  }
}

if (!applyMode && changes.length > 0) {
  console.log(`\nDRY RUN: ${changes.length} file(s) would change. Run with --apply to write.`);
} else if (changes.length === 0) {
  console.log('No changes needed.');
} else {
  console.log(`Done: ${changes.length} file(s) updated.`);
}
