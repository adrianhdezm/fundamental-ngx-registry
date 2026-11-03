import { setProjectAnnotations } from '@analogjs/storybook-angular/testing';
import * as a11yAnnotations from '@storybook/addon-a11y/preview';
import type { StoryContext } from '@analogjs/storybook-angular';
import { beforeAll } from 'vitest';
import { contrastInHighContrast } from '../a11y';
import preview from './preview';

/** The theme of this test project, from `vitest.config.ts`. */
declare const __A11Y_THEME__: string;

/**
 * Each story renders into a new canvas, so overlays (dialogs, menus, popovers) opened by an earlier story would
 * stay in the CDK overlay container on <body>: remove them after every story.
 */
function removeOverlays(): () => void {
    return () => {
        document.querySelectorAll('.cdk-overlay-container').forEach((container) => container.replaceChildren());
        document.documentElement.classList.remove('cdk-global-scrollblock');
    };
}

// Every story is rendered in the theme and checked with axe: a violation fails the test.
const project = setProjectAnnotations([
    a11yAnnotations,
    preview,
    {
        initialGlobals: { theme: __A11Y_THEME__ },
        parameters: { a11y: { test: 'error' } },
        beforeEach: (context: StoryContext) => {
            contrastInHighContrast(__A11Y_THEME__, context.parameters);
            return removeOverlays();
        }
    }
]);

beforeAll(project.beforeAll);
