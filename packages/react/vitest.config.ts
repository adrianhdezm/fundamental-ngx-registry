import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const path = (p: string) => fileURLToPath(new URL(p, import.meta.url));

const browser = () => ({
    enabled: true,
    headless: true,
    viewport: { width: 1280, height: 800 },
    provider: playwright(),
    instances: [{ browser: 'chromium' as const }]
});

/** Every story rendered and checked with axe in a theme (the a11y addon fails the test on violations). */
const storybook = (theme: string) => ({
    plugins: [storybookTest({ configDir: path('./.storybook') })],
    define: { __A11Y_THEME__: JSON.stringify(theme) },
    test: {
        name: `a11y:${theme}`,
        setupFiles: ['.storybook/vitest.setup.ts'],
        browser: browser()
    }
});

// Component tests run in a real Chromium (Vitest browser mode), with the SAP theme and Tailwind styles.
export default defineConfig({
    plugins: [react(), tailwindcss()],
    optimizeDeps: {
        include: [
            'react',
            'react-dom',
            'react-dom/client',
            'react/jsx-runtime',
            'react/jsx-dev-runtime',
            '@base-ui/react',
            'vitest-browser-react'
        ]
    },
    resolve: {
        alias: [
            { find: /^@\/lib\//, replacement: path('./registry/lib/') },
            { find: /^@\/ui\//, replacement: path('./registry/ui/') }
        ]
    },
    test: {
        projects: [
            {
                extends: true,
                test: {
                    name: 'unit',
                    include: ['registry/**/*.spec.{ts,tsx}'],
                    setupFiles: ['tests/setup.ts'],
                    browser: browser()
                }
            },
            { extends: true, ...storybook('sap_horizon') },
            { extends: true, ...storybook('sap_horizon_hcb') }
        ]
    }
});
