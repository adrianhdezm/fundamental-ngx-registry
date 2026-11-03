import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ReactNode } from 'react';
import { fn } from 'storybook/test';
import { Button, type ButtonProps } from './button';

const meta: Meta<typeof Button> = {
    title: 'Components/Button',
    component: Button,
    parameters: {
        docs: {
            description: {
                component:
                    'A button performs an action. Use the **emphasized** option only once within a page or dialog, ' +
                    'and the **negative** type only for actions that are potentially destructive. Icon-only buttons ' +
                    'need an `aria-label`.'
            }
        }
    },
    argTypes: {
        option: { control: 'inline-radio', options: [undefined, 'emphasized', 'transparent'] },
        type: { control: 'select', options: [undefined, 'standard', 'positive', 'negative', 'ghost', 'attention'] }
    },
    args: {
        children: 'Button',
        compact: false,
        disabled: false,
        allowFocusOnDisable: false,
        disabledMessage: 'This button is disabled',
        enabledMessage: 'This button is now enabled',
        onClick: fn()
    }
};
export default meta;
type Story = StoryObj<typeof Button>;

const Row = ({ children }: { children: ReactNode }) => (
    <div className="flex flex-wrap items-center gap-2">{children}</div>
);

/** The controls cover every prop, like the "dev" story of fundamental-react. */
export const Primary: Story = {};

export const Options: Story = {
    parameters: {
        docs: {
            description: {
                story:
                    '**Emphasized**: the one primary call to action of a page. **Default**: the most common button. ' +
                    '**Transparent**: the lowest priority, often in tables, lists and toolbars.'
            }
        }
    },
    render: () => (
        <Row>
            <Button option="emphasized">Emphasized Button</Button>
            <Button>Default Button</Button>
            <Button option="transparent">Transparent Button</Button>
        </Row>
    )
};

export const Types: Story = {
    parameters: {
        docs: {
            description: {
                story:
                    '**Standard**: neutral or informative. **Positive**: approve, OK, yes. **Negative**: decline, ' +
                    'cancel, no. **Ghost**: secondary actions. **Attention**: warnings.'
            }
        }
    },
    render: () => (
        <Row>
            <Button>Default Button</Button>
            <Button type="standard">Standard Button</Button>
            <Button type="positive">Positive Button</Button>
            <Button type="negative">Negative Button</Button>
            <Button type="ghost">Ghost Button</Button>
            <Button type="attention">Attention Button</Button>
        </Row>
    )
};

export const Icons: Story = {
    parameters: {
        docs: { description: { story: 'A button can have an icon with text, or only an icon with an `aria-label`.' } }
    },
    render: () => (
        <div className="flex flex-col gap-4">
            <Row>
                <Button glyph="cart" option="emphasized">
                    Add to Cart
                </Button>
                <Button glyph="cart">Add to Cart</Button>
                <Button glyph="filter" option="transparent">
                    Filter
                </Button>
                <Button glyph="accept" type="positive">
                    Approve
                </Button>
                <Button glyph="decline" type="negative">
                    Reject
                </Button>
                <Button glyph="edit" type="ghost">
                    Edit
                </Button>
                <Button glyph="warning" type="attention">
                    Ignore
                </Button>
                <Button glyph="cart" iconBeforeText>
                    Icon before text
                </Button>
            </Row>
            <Row>
                <Button aria-label="See warning" glyph="alert" option="emphasized" />
                <Button aria-label="Add to cart" glyph="cart" />
                <Button aria-label="Filter" glyph="filter" option="transparent" />
                <Button aria-label="Accept" glyph="accept" type="positive" />
                <Button aria-label="Decline" glyph="decline" type="negative" />
                <Button aria-label="Edit" glyph="edit" type="ghost" />
                <Button aria-label="Ignore" glyph="warning" type="attention" />
            </Row>
        </div>
    )
};

export const Sizes: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Compact is for desktop apps; touch devices use the default size. `compact` is the same as compact density on a container.'
            }
        }
    },
    render: () => (
        <Row>
            <Button>Default</Button>
            <Button compact>Compact</Button>
        </Row>
    )
};

export const Badges: Story = {
    parameters: {
        docs: {
            description: {
                story:
                    'A badge counts items collected from various pages to trigger an action. Use it on emphasized, ' +
                    'standard and transparent buttons, with 4 characters at most.'
            }
        }
    },
    render: () => (
        <div className="flex flex-wrap items-center gap-4 pt-2">
            <Button badge="1234">Default</Button>
            <Button badge="123" option="emphasized">
                Emphasized
            </Button>
            <Button badge="12" option="transparent">
                Transparent
            </Button>
            <Button badge="1234" compact>
                Default compact
            </Button>
            <Button badge="123" compact option="emphasized">
                Emphasized compact
            </Button>
            <Button badge="12" compact option="transparent">
                Transparent compact
            </Button>
        </div>
    )
};

const STATE_ROWS: [string, Partial<ButtonProps>][] = [
    ['Default', {}],
    ['Emphasized', { option: 'emphasized' }],
    ['Transparent', { option: 'transparent' }],
    ['Positive', { type: 'positive' }],
    ['Negative', { type: 'negative' }],
    ['Ghost', { type: 'ghost' }],
    ['Attention', { type: 'attention' }]
];

export const States: Story = {
    parameters: {
        docs: {
            description: {
                story:
                    'Default, `selected`, `disabled`, and `allowFocusOnDisable`: a disabled button that stays ' +
                    'focusable, so that a screen reader can reach it and announce `disabledMessage` (why it is ' +
                    'disabled) and later `enabledMessage`.'
            }
        }
    },
    render: () => (
        <div className="flex flex-col gap-4">
            {STATE_ROWS.map(([name, props]) => (
                <Row key={name}>
                    <Button {...props}>{name}</Button>
                    <Button {...props} selected>
                        {name} selected
                    </Button>
                    <Button {...props} disabled>
                        {name} disabled
                    </Button>
                    <Button
                        {...props}
                        allowFocusOnDisable
                        disabled
                        disabledMessage="This button is disabled while the form is incomplete."
                        enabledMessage="This button is now enabled"
                    >
                        {name} focusable
                    </Button>
                </Row>
            ))}
        </div>
    )
};

function ToggleExample() {
    const [bold, setBold] = useState(false);
    return (
        <Row>
            <Button aria-label="Bold" glyph="bold-text" onClick={() => setBold(!bold)} selected={bold} />
            <span>Bold is {bold ? 'on' : 'off'}</span>
        </Row>
    );
}

export const Toggle: Story = {
    parameters: {
        docs: { description: { story: 'A toggle button keeps `selected` in state; it is exposed as `aria-pressed`.' } }
    },
    render: () => <ToggleExample />
};
