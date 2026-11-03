/**
 * Builds one shadcn-compatible registry per framework, from registry/<framework>/registry.json:
 *
 *   public/r/<framework>/registry.json   the registry index
 *   public/r/<framework>/<name>.json     one registry item per component, with file contents inlined
 *
 * It also enforces the copy-paste contract. A component file may import only:
 *   - the framework's own packages (see FRAMEWORKS) and the npm packages listed in the item's `dependencies`
 *   - @/lib/<name> when <name> is the item itself or listed in `registryDependencies` (e.g. utils, datetime)
 *   - @/ui/<other>/... when <other> is listed in `registryDependencies`
 *   - relative files of its own folder that are part of the item
 *
 * Every folder under registry/<framework>/ui must be a registry item.
 *
 * Usage: REGISTRY_URL=https://example.com/r node scripts/build-registry.mjs [--check]
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, posix, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const checkOnly = process.argv.includes('--check');
const registryUrl = (process.env.REGISTRY_URL ?? 'https://adrianhdezm.github.io/fundamental-ngx-registry/r').replace(
    /\/$/,
    ''
);
const themingVersion = JSON.parse(
    readFileSync(join(root, 'node_modules/@sap-theming/theming-base-content/package.json'), 'utf8')
).version;
const FONT_CDN = `https://cdn.jsdelivr.net/npm/@sap-theming/theming-base-content@${themingVersion}/content/Base/baseLib`;

/** Imports a component may use without listing them in `dependencies`: the framework and what it brings along. */
const FRAMEWORKS = {
    angular: /^(@angular\/|rxjs|tslib)/,
    react: /^(react|react-dom)(\/|$)/
};

const errors = [];

/**
 * The shadcn CLI drops the comment above the first statement of an installed file, which would lose the
 * attribution header. In the registry copy the header goes after the imports (or after the first statement of a
 * file without imports) instead.
 */
function headerAfterImports(content) {
    const header = content.match(/^\/\*[\s\S]*?\*\/\n+/);
    if (!header) return content;
    const body = content.slice(header[0].length);
    const imports = [...body.matchAll(/^import\s[\s\S]*?['"];\n/gm)];
    const anchor = imports.at(-1) ?? body.match(/^[^\n]*;\n/m);
    if (!anchor) return content;
    const end = anchor.index + anchor[0].length;
    return `${body.slice(0, end)}\n${header[0].trimEnd()}\n${body.slice(end)}`;
}

function checkImports(builtin, item, file, content) {
    const own = new Set(item.files.map((f) => f.path));
    for (const [, spec] of content.matchAll(/(?:^|\n)\s*(?:import|export)\s[^'"]*?from\s+'([^']+)'/g)) {
        if (builtin.test(spec)) continue;
        const lib = spec.match(/^@\/lib\/([^/]+)$/);
        if (lib) {
            if (item.name !== lib[1] && !(item.registryDependencies ?? []).includes(lib[1]))
                errors.push(`${file.path}: imports ${spec} without registryDependency "${lib[1]}"`);
            continue;
        }
        const ui = spec.match(/^@\/ui\/([^/]+)\//);
        if (ui) {
            if (!(item.registryDependencies ?? []).includes(ui[1]))
                errors.push(`${file.path}: imports ${spec} without registryDependency "${ui[1]}"`);
            continue;
        }
        if (spec.startsWith('.')) {
            const resolved = posix.normalize(posix.join(posix.dirname(file.path), spec));
            if (!['', '.ts', '.tsx'].some((ext) => own.has(`${resolved}${ext}`)))
                errors.push(`${file.path}: relative import ${spec} is not a file of item "${item.name}"`);
            continue;
        }
        const pkg = spec.startsWith('@') ? spec.split('/').slice(0, 2).join('/') : spec.split('/')[0];
        if (!(item.dependencies ?? []).includes(pkg))
            errors.push(`${file.path}: imports ${pkg} which is not in "dependencies"`);
    }
}

/** Checks registry/<framework>/registry.json and returns its index and items, as published. */
function buildRegistry(framework, builtin) {
    const registry = JSON.parse(readFileSync(join(root, 'registry', framework, 'registry.json'), 'utf8'));
    const items = new Map(registry.items.map((item) => [item.name, item]));

    // every component folder is an item
    for (const dir of readdirSync(join(root, 'registry', framework, 'ui'))) {
        if (!items.has(dir)) errors.push(`registry/${framework}/ui/${dir} is not listed in its registry.json`);
    }

    const out = [];
    for (const item of registry.items) {
        for (const dep of item.registryDependencies ?? []) {
            if (!items.has(dep)) errors.push(`${item.name}: unknown registryDependency "${dep}"`);
        }
        const files = item.files.map((file) => {
            const abs = join(root, file.path);
            if (!existsSync(abs)) {
                errors.push(`${item.name}: missing file ${file.path}`);
                return null;
            }
            let content = readFileSync(abs, 'utf8');
            if (/\.tsx?$/.test(file.path)) {
                checkImports(builtin, item, file, content);
                content = headerAfterImports(content);
            }
            // fonts are binary: point the registry copy of fonts.css at the npm package on a CDN
            if (file.path.endsWith('styles/fonts.css')) {
                content = content.replace(/url\('\.\/fonts\/([^']+)'\)/g, (_, f) => {
                    const dir = /^(SAP-icons|BusinessSuite)/.test(f) ? 'sap_horizon/fonts' : 'baseTheme/fonts';
                    return `url('${FONT_CDN}/${dir}/${f}')`;
                });
            }
            // Components and libs carry no target, so the CLI places them where the app's `ui` and `lib` aliases
            // point; only the styles, which have no alias, keep the target set in registry.json.
            return { path: file.path, type: file.type, target: file.target, content };
        });
        out.push({
            $schema: 'https://ui.shadcn.com/schema/registry-item.json',
            name: item.name,
            type: item.type,
            title: item.title,
            description: item.description,
            ...(item.dependencies && { dependencies: item.dependencies }),
            ...(item.registryDependencies && {
                registryDependencies: item.registryDependencies.map((d) => `${registryUrl}/${framework}/${d}.json`)
            }),
            files: files.filter(Boolean),
            // CSS rules the CLI adds to the app's stylesheet (`tailwind.css` in components.json)
            ...(item.css && { css: item.css })
        });
    }

    const index = {
        ...registry,
        items: registry.items.map(({ files, ...rest }) => ({
            ...rest,
            files: files.map((f) => ({ path: f.path, type: f.type, target: f.target }))
        }))
    };
    return { index, items: out };
}

const registries = Object.entries(FRAMEWORKS).map(([framework, builtin]) => ({
    framework,
    ...buildRegistry(framework, builtin)
}));

if (errors.length) {
    console.error(errors.join('\n'));
    console.error(`\n${errors.length} registry error(s)`);
    process.exit(1);
}

for (const { framework, index, items } of registries) {
    if (!checkOnly) {
        const dir = join(root, 'public/r', framework);
        rmSync(dir, { recursive: true, force: true });
        mkdirSync(dir, { recursive: true });
        for (const item of items) writeFileSync(join(dir, `${item.name}.json`), JSON.stringify(item, null, 2) + '\n');
        writeFileSync(join(dir, 'registry.json'), JSON.stringify(index, null, 2) + '\n');
    }
    console.log(
        `registry ${framework}: ${items.length} items ${checkOnly ? 'checked' : `built into public/r/${framework} (${registryUrl}/${framework})`}`
    );
}
