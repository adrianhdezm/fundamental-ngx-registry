import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { Button } from '@/ui/button/button';
import type { HeaderSize } from '@/ui/title/title';
import {
    ActionBar,
    ActionBarActions,
    ActionBarBack,
    ActionBarDescription,
    ActionBarHeader,
    ActionBarTitle,
    type ActionBarProps,
    type ActionBarSize
} from './action-bar';

const LABEL = 'm-0 mb-2 text-sap-font-small-size text-sap-content-label-color';

interface BarOptions {
    back?: boolean;
    title?: string;
    description?: string;
    size?: ActionBarSize;
    level?: HeaderSize;
    actions?: ReactNode;
}

const SAVE_SUBMIT = (
    <>
        <Button label="Save" />
        <Button variant="emphasized" label="Submit" />
    </>
);

/** An overflow button for the page actions; its menu comes with the menu component. */
const OVERFLOW = <Button variant="transparent" glyph="overflow" aria-label="More actions" title="More actions" />;

function Bar({
    back = true,
    title = 'Page Title',
    description = 'Action bar Description',
    size,
    level,
    actions = SAVE_SUBMIT
}: BarOptions) {
    return (
        <ActionBar size={size}>
            <ActionBarHeader>
                {back && (
                    <ActionBarBack>
                        <Button
                            variant="transparent"
                            glyph="navigation-left-arrow"
                            aria-label="Go back"
                            title="Go back"
                        />
                    </ActionBarBack>
                )}
                <ActionBarTitle level={level}>{title}</ActionBarTitle>
                {actions && <ActionBarActions>{actions}</ActionBarActions>}
            </ActionBarHeader>
            {description && <ActionBarDescription withBackBtn={back}>{description}</ActionBarDescription>}
        </ActionBar>
    );
}

function Labelled({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div>
            <p className={LABEL}>{label}</p>
            {children}
        </div>
    );
}

type PlaygroundArgs = ActionBarProps & { title: string; description: string; back: boolean; level: HeaderSize };

const meta: Meta<PlaygroundArgs> = {
    title: 'Components/Action Bar',
    component: ActionBar,
    parameters: {
        docs: {
            description: {
                component:
                    'The action bar is the header of a page: back button, title, description and page actions. ' +
                    'The back button and description are hidden below 600px.'
            }
        }
    },
    argTypes: {
        size: { control: 'inline-radio', options: ['s', 'm_l', 'xl'] },
        level: { control: { type: 'range', min: 1, max: 6, step: 1 } }
    },
    args: { size: 'm_l', title: 'Page Title', description: 'Action bar Description', back: true, level: 2 }
};
export default meta;
type Story = StoryObj<PlaygroundArgs>;

export const Playground: Story = {
    render: ({ size, title, description, back, level }) => (
        <Bar size={size} title={title} description={description} back={back} level={level} />
    )
};

export const Default: Story = {
    name: 'Back button, title and description',
    render: () => (
        <div className="flex flex-col gap-8">
            <Labelled label="With back button">
                <Bar />
            </Labelled>
            <Labelled label="Without back button">
                <Bar back={false} />
            </Labelled>
            <Labelled label="Without description">
                <Bar description="" />
            </Labelled>
            <Labelled label="Without actions">
                <Bar back={false} description="" actions={null} />
            </Labelled>
            <Labelled label="Long title and description are truncated">
                <Bar
                    title="Page Title Demo for very very very very very very very very very very very very very very very very very very very long text"
                    description="Action bar Description with a very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very long text"
                />
            </Labelled>
        </div>
    )
};

export const Sizes: Story = {
    name: 'Responsive paddings',
    render: () => (
        <div className="flex flex-col gap-8">
            <Labelled label="s">
                <Bar size="s" />
            </Labelled>
            <Labelled label="m_l (default)">
                <Bar size="m_l" />
            </Labelled>
            <Labelled label="xl">
                <Bar size="xl" />
            </Labelled>
        </div>
    )
};

export const ContextualMenu: Story = {
    name: 'Contextual menu',
    parameters: {
        docs: {
            description: {
                story: 'With many page actions, put them in a menu behind an overflow button at the end of the bar.'
            }
        }
    },
    render: () => <Bar back={false} description="" actions={OVERFLOW} />
};

export const Mobile: Story = {
    name: 'Small screen',
    render: () => (
        <>
            <p className={LABEL}>
                Below a 600px wide viewport the back button and description are hidden; resize the window to see it.
            </p>
            <Bar size="s" actions={OVERFLOW} />
        </>
    )
};
