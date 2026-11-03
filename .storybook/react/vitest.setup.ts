import * as a11yAnnotations from '@storybook/addon-a11y/preview';
import { setProjectAnnotations, type StoryContext } from '@storybook/react-vite';
import { beforeAll } from 'vitest';
import { contrastInHighContrast } from '../a11y';
import preview from './preview';

/** The theme of this test project, from `vitest.config.ts`. */
declare const __A11Y_THEME__: string;

// Every story is rendered in the theme and checked with axe: a violation fails the test.
const project = setProjectAnnotations([
    a11yAnnotations,
    preview,
    {
        initialGlobals: { theme: __A11Y_THEME__ },
        parameters: { a11y: { test: 'error' } },
        beforeEach: (context: StoryContext) => contrastInHighContrast(__A11Y_THEME__, context.parameters)
    }
]);

beforeAll(project.beforeAll);
