import angular from '@analogjs/vite-plugin-angular';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import { registryAliases } from './.storybook/aliases.ts';

const path = (p: string) => fileURLToPath(new URL(p, import.meta.url));

const browser = () => ({
    enabled: true,
    headless: true,
    viewport: { width: 1280, height: 800 },
    provider: playwright(),
    instances: [{ browser: 'chromium' as const }]
});

const A11Y_THEMES = ['sap_horizon', 'sap_horizon_hcb'];

/** Every story rendered and checked with axe in a theme (the a11y addon fails the test on violations). */
const angularStorybook = (theme: string) => ({
    plugins: [
        angular({ tsconfig: path('./.storybook/angular/tsconfig.json') }),
        storybookTest({ configDir: path('./.storybook/angular') })
    ],
    resolve: { alias: registryAliases('angular') },
    define: { __A11Y_THEME__: JSON.stringify(theme) },
    test: {
        name: `a11y:angular:${theme}`,
        setupFiles: [path('./.storybook/angular/vitest.setup.ts')],
        browser: browser()
    }
});

const reactStorybook = (theme: string) => ({
    plugins: [storybookTest({ configDir: path('./.storybook/react') })],
    resolve: { alias: registryAliases('react') },
    define: { __A11Y_THEME__: JSON.stringify(theme) },
    test: {
        name: `a11y:react:${theme}`,
        setupFiles: [path('./.storybook/react/vitest.setup.ts')],
        browser: browser()
    }
});

// Component tests run in a real Chromium (Vitest browser mode), with the SAP theme and Tailwind styles.
export default defineConfig({
    plugins: [tailwindcss()],
    // pre-bundle the CDK and React entry points so a newly imported one does not reload a running test
    optimizeDeps: {
        include: [
            '@angular/cdk/a11y',
            '@angular/cdk/bidi',
            '@angular/cdk/drag-drop',
            '@angular/cdk/keycodes',
            '@angular/cdk/overlay',
            '@angular/cdk/portal',
            '@angular/cdk/scrolling',
            '@angular/common/locales/de',
            '@angular/forms',
            '@angular/platform-browser',
            'react',
            'react/jsx-dev-runtime',
            'react-dom/client',
            'vitest-browser-react'
        ]
    },
    test: {
        projects: [
            {
                extends: true,
                plugins: [angular({ tsconfig: path('./tests/angular/tsconfig.json') })],
                resolve: { alias: registryAliases('angular') },
                test: {
                    name: 'angular',
                    include: ['registry/angular/**/*.spec.ts', 'registry/lib/*.spec.ts'],
                    setupFiles: ['tests/angular/setup.ts'],
                    browser: browser()
                }
            },
            {
                extends: true,
                plugins: [react()],
                resolve: { alias: registryAliases('react') },
                test: {
                    name: 'react',
                    include: ['registry/react/**/*.spec.tsx'],
                    setupFiles: ['tests/react/setup.ts'],
                    browser: browser()
                }
            },
            ...A11Y_THEMES.map((theme) => ({ extends: true, ...angularStorybook(theme) })),
            ...A11Y_THEMES.map((theme) => ({ extends: true, ...reactStorybook(theme) }))
        ]
    }
});
