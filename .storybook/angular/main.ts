import type { StorybookConfig } from '@analogjs/storybook-angular';
import tailwindcss from '@tailwindcss/vite';
import remarkGfm from 'remark-gfm';
import { fileURLToPath } from 'node:url';
import { mergeConfig, type UserConfig } from 'vite';
import { registryAliases } from '../aliases';

const config: StorybookConfig = {
    stories: [
        '../../docs/**/*.mdx',
        '../../docs/**/*.stories.ts',
        '../../registry/angular/**/*.mdx',
        '../../registry/angular/**/*.stories.ts'
    ],
    addons: [
        // GitHub-flavoured Markdown (tables) in the .mdx pages
        {
            name: '@storybook/addon-docs',
            options: { mdxPluginOptions: { mdxCompileOptions: { remarkPlugins: [remarkGfm] } } }
        },
        '@storybook/addon-a11y'
    ],
    framework: {
        name: '@analogjs/storybook-angular',
        // the preset looks for .storybook/tsconfig.json otherwise (the Vitest addon runs without angular.json)
        options: { tsconfig: fileURLToPath(new URL('./tsconfig.json', import.meta.url)) }
    },
    // the React Storybook, composed into this one: `pnpm storybook` serves it on 6007, the build puts it under react/
    refs: {
        react: { title: 'React', url: process.env['STORYBOOK_REACT_URL'] ?? 'http://localhost:6007' }
    },
    // serves the built registries at /r/<framework>/<name>.json next to the stories
    staticDirs: [{ from: '../../public', to: '/' }],
    core: {
        disableTelemetry: true
    },
    async viteFinal(config: UserConfig) {
        return mergeConfig(config, {
            plugins: [tailwindcss()],
            resolve: { alias: registryAliases('angular') }
        });
    }
};

export default config;
