import type { Decorator, Preview } from '@storybook/react-vite';
import { applyFoundation, globalTypes, initialGlobals, parameters } from '../foundation';
import './styles.css';

const withFoundation: Decorator = (Story, context) => {
    applyFoundation(context.globals);
    return (
        <div className="p-4" dir={context.globals['dir'] ?? 'ltr'}>
            <Story />
        </div>
    );
};

const preview: Preview = {
    globalTypes,
    initialGlobals,
    decorators: [withFoundation],
    parameters: {
        ...parameters,
        options: {
            storySort: {
                order: ['Components']
            }
        }
    }
};

export default preview;
