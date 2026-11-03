import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '@/ui/button/button';
import { SegmentedButton } from './segmented-button';

const meta: Meta<typeof SegmentedButton> = {
    title: 'Components/Segmented Button',
    component: SegmentedButton,
    parameters: {
        docs: {
            description: {
                component:
                    'Groups a series of buttons on a single line. Only one option is active at a time, like a radio ' +
                    'button group: the app keeps the selection and marks that button `selected`.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<typeof SegmentedButton>;

const CHARTS = [
    ['survey', 'Survey'],
    ['pie-chart', 'Pie chart'],
    ['pool', 'Pool']
] as const;

function IconSegments() {
    const [selected, setSelected] = useState('pie-chart');
    return (
        <SegmentedButton aria-label="Chart type">
            {CHARTS.map(([glyph, label]) => (
                <Button
                    aria-label={label}
                    glyph={glyph}
                    key={glyph}
                    onClick={() => setSelected(glyph)}
                    selected={selected === glyph}
                />
            ))}
        </SegmentedButton>
    );
}

export const Primary: Story = {
    render: () => <IconSegments />
};

function TextSegments({ compact }: { compact?: boolean }) {
    const [selected, setSelected] = useState('Middle');
    return (
        <SegmentedButton aria-label="Position">
            {['Left', 'Middle', 'Right'].map((label) => (
                <Button compact={compact} key={label} onClick={() => setSelected(label)} selected={selected === label}>
                    {label}
                </Button>
            ))}
        </SegmentedButton>
    );
}

export const Text: Story = {
    render: () => <TextSegments />
};

export const Compact: Story = {
    render: () => <TextSegments compact />
};
