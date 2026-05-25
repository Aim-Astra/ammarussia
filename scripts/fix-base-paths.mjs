// Post-build script: add /ammarussia prefix to absolute-path assets in built HTML
// Run after `astro build`

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, extname } from 'path';

const DIST = './dist';
const BASE = '/ammarussia';
const HTML_EXTENSIONS = ['.html', '.htm'];

// Pages that need fixing (relative to dist)
const pages = [
  'index.html',
  'ru/index.html',
  'committee/index.html',
  'contact/index.html',
];

function processFile(filePath) {
  let content = readFileSync(filePath, 'utf-8');
  let modified = false;
  
  // Fix image src attributes: /images/ -> /ammarussia/images/
  // but skip /ammarussia/_astro/ which is already correct
  const original = content;
  
  // Replace src="/images/ with src="/ammarussia/images/
  content = content.replace(/src="\/images\//g, 'src="/ammarussia/images/');
  // Replace src='/images/ with src='/ammarussia/images/ (single quotes)
  content = content.replace(/src='\/images\//g, "src='/ammarussia/images/");
  
  if (content !== original) {
    modified = true;
    const count = (original.match(/src="\/images\//g) || []).length;
    console.log(`  ✓ ${filePath}: fixed ${count} image path(s)`);
  }
  
  if (modified) {
    writeFileSync(filePath, content, 'utf-8');
  }
}

console.log('\n🔧 Fixing base paths in built HTML...\n');

for (const page of pages) {
  const filePath = join(DIST, page);
  try {
    processFile(filePath);
  } catch (e) {
    console.log(`  ✗ ${page}: ${e.message}`);
  }
}

console.log('\n✅ Done!\n');
