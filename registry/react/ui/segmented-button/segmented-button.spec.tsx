import { createRef } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { Button } from '@/ui/button/button';
import { SegmentedButton } from './segmented-button';

/** The computed colour of a theme variable, to compare with the buttons' colours. */
function resolve(variable: string): string {
    const probe = document.createElement('span');
    probe.style.color = `var(${variable})`;
    document.body.appendChild(probe);
    const color = getComputedStyle(probe).color;
    probe.remove();
    return color;
}

const segments = (
    <SegmentedButton aria-label="View" data-sample="Sample">
        <Button selected={false}>Left</Button>
        <Button selected>Middle</Button>
        <Button selected={false}>Right</Button>
    </SegmentedButton>
);

describe('SegmentedButton', () => {
    afterEach(() => document.documentElement.removeAttribute('data-sap-theme'));

    it('spreads other props to the group', async () => {
        const screen = await render(segments);
        expect(screen.getByRole('group').element().getAttribute('data-sample')).toBe('Sample');
    });

    it('forwards the ref', async () => {
        const ref = createRef<HTMLDivElement>();
        await render(<SegmentedButton ref={ref} />);
        expect(ref.current?.tagName).toBe('DIV');
        expect(ref.current?.getAttribute('role')).toBe('group');
    });

    it('is a labelled group of toggle buttons, the selected one pressed', async () => {
        await render(segments);
        await expect.element(page.getByRole('group', { name: 'View' })).toBeInTheDocument();
        await expect.element(page.getByRole('button', { name: 'Middle', pressed: true })).toBeInTheDocument();
        await expect.element(page.getByRole('button', { name: 'Left', pressed: false })).toBeInTheDocument();
    });

    it('joins the buttons on one pad: transparent segments, the selected one highlighted', async () => {
        const screen = await render(segments);
        const group = screen.getByRole('group').element();
        const [left, middle, right] = screen.getByRole('button').elements();
        // one line, no gaps between the segments
        expect(left.getBoundingClientRect().right).toBe(middle.getBoundingClientRect().left);
        expect(middle.getBoundingClientRect().right).toBe(right.getBoundingClientRect().left);
        expect(left.getBoundingClientRect().top).toBe(right.getBoundingClientRect().top);

        expect(getComputedStyle(group).backgroundColor).toBe(resolve('--sapButton_Background'));
        expect(getComputedStyle(left).backgroundColor).toBe('rgba(0, 0, 0, 0)');
        expect(getComputedStyle(middle).backgroundColor).toBe(resolve('--sapButton_Selected_Background'));
    });

    it('high contrast: bordered segments with square inner corners, joined border to border', async () => {
        document.documentElement.setAttribute('data-sap-theme', 'sap_horizon_hcb');
        const screen = await render(segments);
        const [left, middle, right] = screen.getByRole('button').elements();
        expect(getComputedStyle(left).borderTopLeftRadius).toBe('6px');
        expect(getComputedStyle(left).borderTopRightRadius).toBe('0px');
        expect(getComputedStyle(middle).borderTopLeftRadius).toBe('0px');
        expect(getComputedStyle(right).borderTopLeftRadius).toBe('0px');
        expect(getComputedStyle(right).borderTopRightRadius).toBe('6px');
        expect(getComputedStyle(left).borderTopColor).toBe(resolve('--sapButton_BorderColor'));
        // neighbouring borders overlap instead of doubling
        const bw = parseFloat(getComputedStyle(left).borderRightWidth);
        expect(left.getBoundingClientRect().right - middle.getBoundingClientRect().left).toBeCloseTo(bw, 1);
    });

    it('keeps the outer corners when a button renders its hidden instructions', async () => {
        const screen = await render(
            <SegmentedButton aria-label="Actions">
                <Button>First</Button>
                <Button allowFocusOnDisable disabled disabledMessage="Not available yet.">
                    Last
                </Button>
            </SegmentedButton>
        );
        document.documentElement.setAttribute('data-sap-theme', 'sap_horizon_hcb');
        const first = screen.getByRole('button', { name: 'First' }).element();
        const last = screen.getByRole('button', { name: 'Last' }).element();
        expect(getComputedStyle(first).borderTopRightRadius).toBe('0px');
        expect(getComputedStyle(last).borderTopRightRadius).toBe('6px');
    });
});
