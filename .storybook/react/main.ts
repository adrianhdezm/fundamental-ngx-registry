import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';
import { mergeConfig, type UserConfig } from 'vite';
import { registryAliases } from '../aliases';

const config: StorybookConfig = {
    stories: ['../../registry/react/**/*.stories.tsx'],
    addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
    framework: {
        name: '@storybook/react-vite',
        options: {}
    },
    core: {
        disableTelemetry: true
    },
    async viteFinal(config: UserConfig) {
        return mergeConfig(config, {
            plugins: [tailwindcss()],
            resolve: { alias: registryAliases('react') }
        });
    }
};

export default config;
