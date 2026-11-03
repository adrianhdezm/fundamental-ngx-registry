import { fileURLToPath } from 'node:url';

const registry = (path: string) => fileURLToPath(new URL(`../registry/${path}`, import.meta.url));

/**
 * Vite aliases of a framework's registry: the same as the `paths` of registry/<framework>/tsconfig.json, the ones
 * users configure when copying components. `@/lib/utils` is shared by every framework.
 */
export const registryAliases = (framework: 'angular' | 'react') => [
    { find: /^@\/lib\/utils$/, replacement: registry('lib/utils') },
    { find: /^@\/lib\//, replacement: registry(`${framework}/lib/`) },
    { find: /^@\/ui\//, replacement: registry(`${framework}/ui/`) }
];
