#!/usr/bin/env node
import {promises as fs} from 'fs';
import path from 'path';

const projectRoot = process.cwd();
const srcRoot = path.join(projectRoot, 'src');

async function walk(dir, exts = ['.js', '.ts']) {
  const out = [];
  const entries = await fs.readdir(dir, {withFileTypes: true});
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      out.push(...await walk(p, exts));
    } else if (exts.includes(path.extname(e.name))) {
      out.push(p);
    }
  }
  return out;
}

function ensureJsExtension(spec) {
  if (/\.(js|json|node)$/i.test(spec)) return spec;
  if (spec.endsWith('/')) return spec;
  return spec + '.js';
}

function toRelative(fromFile, absTarget) {
  let rel = path.relative(path.dirname(fromFile), absTarget);
  if (!rel.startsWith('.')) rel = './' + rel;
  // On Windows, convert backslashes to POSIX for ESM imports
  rel = rel.split(path.sep).join('/');
  return rel;
}

function rewriteImports(content, filePath) {
  const importLike = /\b(import\s+[^'"\n;]*?from\s*['"][^'"]+['"]|export\s+\*?\s*from\s*['"][^'"]+['"]|import\s*\(\s*['"][^'"]+['"]\s*\))/g;
  return content.replace(importLike, (stmt) => {
    const m = stmt.match(/(['"])([^'"]+)(['"])$/);
    if (!m) return stmt;
    const spec = m[2];
    let newSpec = spec;
    if (spec.startsWith('@/')) {
      const rest = spec.slice(2); // remove '@/'
      const target = path.join(srcRoot, rest);
      let rel = toRelative(filePath, target);
      rel = ensureJsExtension(rel);
      newSpec = rel;
    } else if (spec.startsWith('./') || spec.startsWith('../')) {
      // If it points inside project and lacks extension, append .js
      newSpec = ensureJsExtension(spec);
    } else {
      return stmt; // bare specifier, leave as is
    }
    return stmt.replace(spec, newSpec);
  });
}

async function processFiles() {
  const targets = [
    ...(await walk(srcRoot, ['.js'])),
  ];
  // Also include app.ts, server.ts, tests/**/*.ts
  const extras = [];
  const appTs = path.join(projectRoot, 'app.ts');
  const serverTs = path.join(projectRoot, 'server.ts');
  for (const p of [appTs, serverTs]) {
    try { await fs.access(p); extras.push(p); } catch {}
  }
  async function walkTests(dir) {
    try {
      const files = await walk(dir, ['.ts']);
      extras.push(...files);
    } catch {}
  }
  await walkTests(path.join(projectRoot, 'tests'));

  const all = [...targets, ...extras];
  for (const file of all) {
    const orig = await fs.readFile(file, 'utf8');
    const changed = rewriteImports(orig, file);
    if (changed !== orig) {
      await fs.writeFile(file, changed, 'utf8');
    }
  }

  // Update swagger globs if present
  const swaggerPath = path.join(srcRoot, 'config', 'swagger.js');
  try {
    const s = await fs.readFile(swaggerPath, 'utf8');
    let s2 = s.replaceAll('./src/routes/**/*.ts', './src/routes/**/*.js')
              .replaceAll('./src/controllers/**/*.ts', './src/controllers/**/*.js')
              .replaceAll('./src/docs/**/*.ts', './src/docs/**/*.js')
              .replaceAll('./app.ts', './app.js');
    if (s2 !== s) await fs.writeFile(swaggerPath, s2, 'utf8');
  } catch {}
}

processFiles().catch((e) => {
  console.error(e);
  process.exit(1);
});
