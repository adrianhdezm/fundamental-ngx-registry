/**
 * Compares components with the fundamental-styles Storybook (the visual reference) in every combination of theme
 * (4), density (cozy, compact) and direction (LTR, RTL): 16 per case.
 *
 * Each case in scripts/visual.config.mjs pairs an element of one of our stories with the matching element of a
 * fundamental-styles story. For every combination the script renders both, then compares
 *   - the computed styles that make up the look (size, spacing, typography, colours, borders, radius, shadow), and
 *   - element screenshots, pixel by pixel with a tolerance (the markup differs, so pixel-exact is not expected).
 * Style differences and screenshots over the tolerance are listed in .visual/<name>/report.md, with the
 * screenshots (ours, reference, diff) next to it, to be checked by hand and logged in docs/parity/components/.
 *
 * Usage:
 *   pnpm build-storybook                     # our Storybook, served from dist/storybook by this script
 *   pnpm visual <name> [<name> ...]          # or `pnpm visual --all`
 *   pnpm visual button --only=sap_horizon    # limit to combinations whose key contains the text
 *
 * The reference is https://sap.github.io/fundamental-styles/ (override with FS_URL).
 */
import { createReadStream, existsSync, mkdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import pixelmatch from 'pixelmatch';
import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import { CASES } from './visual.config.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const FS_URL = (process.env.FS_URL ?? 'https://sap.github.io/fundamental-styles').replace(/\/$/, '');
const THEMES = ['sap_horizon', 'sap_horizon_dark', 'sap_horizon_hcb', 'sap_horizon_hcw'];
const DENSITIES = ['cozy', 'compact'];
const DIRS = ['ltr', 'rtl'];
/** Share of differing pixels (after pixelmatch's own anti-aliasing tolerance) still counted as a match. */
const PIXEL_TOLERANCE = 0.03;
/** Pixels of size difference still counted as a match (sub-pixel rounding, font hinting). */
const SIZE_TOLERANCE = 1;

const STYLE_PROPS = [
    'height',
    'min-height',
    'padding-top',
    'padding-right',
    'padding-bottom',
    'padding-left',
    'font-family',
    'font-size',
    'font-weight',
    'font-style',
    'line-height',
    'letter-spacing',
    'text-transform',
    'text-decoration-line',
    'color',
    'background-color',
    'background-image',
    'border-top-width',
    'border-right-width',
    'border-bottom-width',
    'border-left-width',
    'border-top-style',
    'border-top-color',
    'border-right-color',
    'border-bottom-color',
    'border-left-color',
    'border-top-left-radius',
    'border-top-right-radius',
    'border-bottom-right-radius',
    'border-bottom-left-radius',
    'box-shadow',
    'opacity',
    'cursor'
];

const args = process.argv.slice(2);
const only = args.find((a) => a.startsWith('--only='))?.slice('--only='.length);
const names = args.includes('--all') ? Object.keys(CASES) : args.filter((a) => !a.startsWith('--'));
if (!names.length) {
    console.error(`usage: pnpm visual <name> [...] | --all\nknown: ${Object.keys(CASES).join(', ')}`);
    process.exit(1);
}
for (const name of names) {
    if (!CASES[name]) {
        console.error(`no visual cases for "${name}" in scripts/visual.config.mjs`);
        process.exit(1);
    }
}

const storybookDir = join(root, 'dist/storybook');
if (!existsSync(join(storybookDir, 'iframe.html'))) {
    console.error('dist/storybook is missing: run `pnpm build-storybook` first');
    process.exit(1);
}

const TYPES = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.svg': 'image/svg+xml',
    '.woff2': 'font/woff2',
    '.png': 'image/png'
};
const server = createServer((req, res) => {
    const path = join(storybookDir, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    const file = existsSync(path) && statSync(path).isDirectory() ? join(path, 'index.html') : path;
    if (!file.startsWith(storybookDir) || !existsSync(file)) {
        res.writeHead(404).end();
        return;
    }
    res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
    createReadStream(file).pipe(res);
});
await new Promise((ok) => server.listen(0, '127.0.0.1', ok));
const OURS_URL = `http://127.0.0.1:${server.address().port}`;

const combos = THEMES.flatMap((theme) =>
    DENSITIES.flatMap((density) => DIRS.map((dir) => ({ theme, density, dir, key: `${theme}-${density}-${dir}` })))
).filter((c) => !only || c.key.includes(only));

const oursUrl = (story, c) =>
    `${OURS_URL}/iframe.html?id=${story}&viewMode=story&globals=theme:${c.theme};density:${c.density};dir:${c.dir}`;
const refUrl = (story, c) =>
    `${FS_URL}/iframe.html?id=${story}&viewMode=story&globals=styles-theme:${c.theme};contentDensity:${c.density};directionality:${c.dir}`;

/** Renders a story and returns the computed styles, size and screenshot of the element matched by `selector`. */
async function capture(page, url, selector, hover) {
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const el = page.locator(selector).first();
    await el.waitFor({ state: 'visible', timeout: 15000 });
    if (hover) await el.hover();
    else await page.mouse.move(0, 0);
    await page.waitForTimeout(150);
    const styles = await el.evaluate((node, props) => {
        const cs = getComputedStyle(node);
        const box = node.getBoundingClientRect();
        return {
            width: box.width,
            height: box.height,
            styles: Object.fromEntries(props.map((p) => [p, cs.getPropertyValue(p)]))
        };
    }, STYLE_PROPS);
    const png = PNG.sync.read(await el.screenshot({ animations: 'disabled' }));
    return { ...styles, png };
}

/** Normalises values that are equal but print differently (font stacks, sub-pixel lengths, transparent). */
function normalise(prop, value) {
    let v = value.trim();
    if (prop === 'font-family') v = v.split(',')[0].replace(/["']/g, '').trim();
    v = v.replace(/rgba\(0, 0, 0, 0\)/g, 'transparent');
    v = v.replace(/(\d+\.\d+)px/g, (_, n) => `${Math.round(Number(n) * 2) / 2}px`);
    return v;
}

function compareImages(a, b, diffPath) {
    if (Math.abs(a.width - b.width) > SIZE_TOLERANCE || Math.abs(a.height - b.height) > SIZE_TOLERANCE) {
        return { ratio: 1, note: `size ${a.width}x${a.height} vs ${b.width}x${b.height}` };
    }
    const width = Math.min(a.width, b.width);
    const height = Math.min(a.height, b.height);
    const crop = (img) => {
        const out = new PNG({ width, height });
        PNG.bitblt(img, out, 0, 0, width, height, 0, 0);
        return out;
    };
    const diff = new PNG({ width, height });
    const pixels = pixelmatch(crop(a).data, crop(b).data, diff.data, width, height, { threshold: 0.15 });
    writeFileSync(diffPath, PNG.sync.write(diff));
    return { ratio: pixels / (width * height), note: '' };
}

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
const page = await context.newPage();
let failures = 0;

for (const name of names) {
    const outDir = join(root, '.visual', name);
    rmSync(outDir, { recursive: true, force: true });
    mkdirSync(outDir, { recursive: true });
    const rows = [];
    for (const kase of CASES[name]) {
        for (const c of combos) {
            const id = `${kase.label.replace(/\W+/g, '-')}--${c.key}`;
            let row;
            try {
                const ours = await capture(page, oursUrl(kase.ours.story, c), kase.ours.selector, kase.hover);
                const ref = await capture(page, refUrl(kase.ref.story, c), kase.ref.selector, kase.hover);
                writeFileSync(join(outDir, `${id}.ours.png`), PNG.sync.write(ours.png));
                writeFileSync(join(outDir, `${id}.ref.png`), PNG.sync.write(ref.png));
                const ignore = new Set(kase.ignore ?? []);
                // the style and colour of a border nobody can see do not matter
                for (const side of ['top', 'right', 'bottom', 'left']) {
                    if (
                        parseFloat(ours.styles[`border-${side}-width`]) === 0 &&
                        parseFloat(ref.styles[`border-${side}-width`]) === 0
                    ) {
                        ignore.add(`border-${side}-color`);
                        if (side === 'top') ignore.add('border-top-style');
                    }
                }
                const styleDiffs = STYLE_PROPS.filter((p) => !ignore.has(p))
                    .map((p) => [p, normalise(p, ours.styles[p]), normalise(p, ref.styles[p])])
                    .filter(([, a, b]) => a !== b);
                if (!ignore.has('width') && Math.abs(ours.width - ref.width) > SIZE_TOLERANCE)
                    styleDiffs.push(['width', `${ours.width}px`, `${ref.width}px`]);
                const image = compareImages(ours.png, ref.png, join(outDir, `${id}.diff.png`));
                const ok = !styleDiffs.length && image.ratio <= PIXEL_TOLERANCE;
                row = { kase: kase.label, combo: c.key, ok, styleDiffs, image };
            } catch (error) {
                row = {
                    kase: kase.label,
                    combo: c.key,
                    ok: false,
                    styleDiffs: [],
                    image: { ratio: 1, note: String(error.message).split('\n')[0] }
                };
            }
            if (!row.ok) failures++;
            rows.push(row);
            process.stdout.write(row.ok ? '.' : 'x');
        }
    }
    process.stdout.write('\n');

    const lines = [
        `# Visual comparison: ${name}`,
        '',
        `Reference: ${FS_URL}. Tolerance: ${PIXEL_TOLERANCE * 100}% of pixels, ${SIZE_TOLERANCE}px of size.`,
        '',
        '| Case | Combination | Result | Pixels | Style differences (ours → reference) |',
        '| ---- | ----------- | ------ | ------ | ------------------------------------ |',
        ...rows.map(
            (r) =>
                `| ${r.kase} | ${r.combo} | ${r.ok ? 'ok' : '**diff**'} | ${(r.image.ratio * 100).toFixed(1)}%${r.image.note ? ` (${r.image.note})` : ''} | ${r.styleDiffs.map(([p, a, b]) => `\`${p}\`: ${a} → ${b}`).join('<br>')} |`
        )
    ];
    writeFileSync(join(outDir, 'report.md'), lines.join('\n') + '\n');
    const bad = rows.filter((r) => !r.ok).length;
    console.log(`${name}: ${rows.length - bad}/${rows.length} match, report in .visual/${name}/report.md`);
}

await browser.close();
server.close();
process.exit(failures ? 1 : 0);
