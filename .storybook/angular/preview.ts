import { BidiModule } from '@angular/cdk/bidi';
import { componentWrapperDecorator, moduleMetadata, type Decorator, type Preview } from '@analogjs/storybook-angular';
import { applyFoundation, globalTypes, initialGlobals, parameters } from '../foundation';
import './styles.css';

const withFoundation: Decorator = (storyFn, context) => {
    applyFoundation(context.globals);
    return storyFn();
};

const preview: Preview = {
    globalTypes,
    initialGlobals,
    decorators: [
        moduleMetadata({ imports: [BidiModule] }),
        // CDK Directionality for the story subtree (components and their overlays).
        componentWrapperDecorator(
            (story) => `<div [dir]="__dir" class="p-4">${story}</div>`,
            ({ globals }) => ({ __dir: globals['dir'] ?? 'ltr' })
        ),
        withFoundation
    ],
    parameters: {
        ...parameters,
        options: {
            storySort: {
                order: ['Introduction', 'Foundations', 'Components']
            }
        }
    }
};

export default preview;
