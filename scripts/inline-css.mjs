#!/usr/bin/env node
// Post-build script: inline all <link rel="stylesheet"> into <style> tags
// This eliminates cross-origin CSS loading issues and speeds up rendering.
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, extname } from 'path';

const distDir = process.argv[2] || 'dist';

function inlineCSS(htmlPath) {
  let html = readFileSync(htmlPath, 'utf8');

  // Find all stylesheet links
  const cssLinkRegex = /<link[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi;
  let match;
  let replacements = [];

  while ((match = cssLinkRegex.exec(html)) !== null) {
    const fullTag = match[0];
    const cssPath = match[1];
    const absPath = join(distDir, cssPath.replace(/^\//, ''));

    try {
      const css = readFileSync(absPath, 'utf8');
      // Replace the <link> with an inline <style>
      const inlineStyle = `<style>${css}</style>`;
      html = html.replace(fullTag, inlineStyle);
      replacements.push({ tag: fullTag.substring(0, 60), cssSize: css.length });
    } catch (e) {
      console.warn(`  ⚠ Could not inline ${cssPath}: ${e.message}`);
    }
  }

  writeFileSync(htmlPath, html);
  return replacements;
}

function walkDir(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkDir(full));
    } else if (extname(entry.name) === '.html') {
      files.push(full);
    }
  }
  return files;
}

console.log('\n🔧 Inlining CSS for GitHub Pages subdirectory deploy...\n');
const htmlFiles = walkDir(distDir);
let totalInlined = 0;

for (const file of htmlFiles) {
  const rel = file.replace(distDir + '/', '');
  const reps = inlineCSS(file);
  if (reps.length > 0) {
    console.log(`  ✓ ${rel}`);
    reps.forEach(r => console.log(`    → inlined ${r.cssSize}b from ${r.tag}...`));
    totalInlined += reps.length;
  }
}

console.log(`\n✅ Inlined CSS in ${totalInlined} stylesheet(s) across ${htmlFiles.length} page(s)\n`);
