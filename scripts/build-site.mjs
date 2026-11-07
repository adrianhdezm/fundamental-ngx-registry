/**
 * Assembles the GitHub Pages site in dist/site:
 *
 *   dist/site/index.html     the landing page (site/index.html)
 *   dist/site/<package>/     the Storybook of packages/<package>, with its registry under <package>/r/
 *
 * Run `pnpm -r build-storybook` first; every package with a dist/storybook folder is published.
 *
 * Usage: node scripts/build-site.mjs
 */
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'dist/site');

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
cpSync(join(root, 'site'), out, { recursive: true });

const published = [];
for (const name of readdirSync(join(root, 'packages'))) {
    const storybook = join(root, 'packages', name, 'dist/storybook');
    if (!existsSync(storybook)) continue;
    cpSync(storybook, join(out, name), { recursive: true });
    published.push(name);
}

if (!published.length) {
    console.error('site: no packages/*/dist/storybook found, run `pnpm -r build-storybook` first');
    process.exit(1);
}
console.log(`site: dist/site with ${published.map((name) => `/${name}/`).join(', ')}`);
