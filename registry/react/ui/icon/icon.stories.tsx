import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { SAP_ICONS, SAP_ICONS_BUSINESS_SUITE, SAP_ICONS_TNT } from './icon-glyphs';
import { Icon, type IconFont } from './icon';

const meta: Meta<typeof Icon> = {
    title: 'Components/Icon',
    component: Icon,
    parameters: {
        docs: {
            description: {
                component:
                    'Icons save space and give visual clarity and focus. An icon is decorative unless it has an ' +
                    '`ariaLabel`, which makes it an image for assistive technology.'
            }
        }
    },
    argTypes: {
        size: { control: 'inline-radio', options: [undefined, 's', 'm', 'l', 'xl'] }
    },
    args: { glyph: 'cart', ariaLabel: 'Cart' }
};
export default meta;
type Story = StoryObj<typeof Icon>;

export const Primary: Story = {};

export const Sizes: Story = {
    render: () => (
        <div className="flex items-center gap-4">
            <Icon ariaLabel="Cart, size s" glyph="cart" size="s" />
            <Icon ariaLabel="Cart, default size" glyph="cart" />
            <Icon ariaLabel="Cart, size m" glyph="cart" size="m" />
            <Icon ariaLabel="Cart, size l" glyph="cart" size="l" />
            <Icon ariaLabel="Cart, size xl" glyph="cart" size="xl" />
        </div>
    )
};

export const Colors: Story = {
    parameters: {
        docs: {
            description: { story: 'Semantic colours, and backgrounds that switch the glyph to a contrasting colour.' }
        }
    },
    render: () => (
        <div className="flex flex-col gap-4">
            <div className="flex gap-4">
                {(
                    [
                        'default',
                        'contrast',
                        'non-interactive',
                        'tile',
                        'marker',
                        'critical',
                        'negative',
                        'neutral',
                        'positive',
                        'information'
                    ] as const
                ).map((color) => (
                    <Icon ariaLabel={color} color={color} glyph="accept" key={color} size="xl" />
                ))}
            </div>
            <div className="flex gap-4">
                {(
                    ['default', 'tile', 'marker', 'critical', 'negative', 'neutral', 'positive', 'information'] as const
                ).map((background) => (
                    <Icon
                        ariaLabel={background}
                        background={background}
                        className="rounded-full p-2"
                        glyph="accept"
                        key={background}
                        size="l"
                    />
                ))}
            </div>
        </div>
    )
};

export const RTL: Story = {
    name: 'Mirroring in RTL',
    parameters: {
        docs: { description: { story: 'Switch Direction to RTL in the toolbar: directional glyphs flip.' } }
    },
    render: () => (
        <div className="flex gap-4 text-sap-content-icon-color">
            <Icon glyph="navigation-right-arrow" size="xl" />
            <Icon glyph="nav-back" size="xl" />
            <Icon glyph="arrow-right" size="xl" />
            <Icon glyph="accept" size="xl" />
        </div>
    )
};

function Gallery({ glyphs, font }: { glyphs: string[]; font: IconFont }) {
    const [filter, setFilter] = useState('');
    return (
        <>
            <input
                aria-label="Search icons"
                className="mb-4 h-sap-element-height w-72 rounded-sap-field-border-corner-radius border border-sap-field-border-color bg-sap-field-background px-2 text-sap-field-text-color"
                onChange={(event) => setFilter(event.target.value)}
                placeholder="Search icons"
                value={filter}
            />
            <div className="grid grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] gap-2">
                {glyphs
                    .filter((glyph) => !filter || glyph.includes(filter))
                    .map((glyph) => (
                        <div
                            className="flex flex-col items-center gap-2 rounded-sap-element-border-corner-radius bg-sap-tile-background p-3 text-center text-sap-content-icon-color"
                            key={glyph}
                        >
                            <Icon font={font} glyph={glyph} size="xl" />
                            <span
                                className="w-full truncate text-sap-font-small-size text-sap-content-label-color"
                                title={glyph}
                            >
                                {glyph}
                            </span>
                        </div>
                    ))}
            </div>
        </>
    );
}

export const IconList: Story = {
    name: 'All SAP-icons',
    render: () => <Gallery font="SAP-icons" glyphs={Object.keys(SAP_ICONS)} />
};

export const TntIcons: Story = {
    name: 'All SAP-icons-TNT',
    render: () => <Gallery font="SAP-icons-TNT" glyphs={Object.keys(SAP_ICONS_TNT)} />
};

export const BusinessSuiteIcons: Story = {
    name: 'All Business Suite icons',
    render: () => <Gallery font="BusinessSuiteInAppSymbols" glyphs={Object.keys(SAP_ICONS_BUSINESS_SUITE)} />
};
