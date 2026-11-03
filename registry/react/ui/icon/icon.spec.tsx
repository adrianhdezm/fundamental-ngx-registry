import { createRef, type ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { Icon, iconGlyphChar } from './icon';

/** The computed colour of a theme variable, to compare with the icon's colours. */
function resolve(variable: string): string {
    const probe = document.createElement('span');
    probe.style.color = `var(${variable})`;
    document.body.appendChild(probe);
    const color = getComputedStyle(probe).color;
    probe.remove();
    return color;
}

async function renderIcon(ui: ReactNode) {
    const screen = await render(ui);
    return { screen, icon: screen.container.querySelector('i')! };
}

const before = (icon: HTMLElement) => getComputedStyle(icon, '::before');

describe('Icon', () => {
    afterEach(() => document.documentElement.removeAttribute('dir'));

    it('calls onClick when clicked', async () => {
        const onClick = vi.fn();
        const { icon } = await renderIcon(<Icon glyph="cart" onClick={onClick} />);
        await userEvent.click(icon);
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('passes ariaLabel as aria-label and makes the icon an image', async () => {
        const { icon } = await renderIcon(<Icon ariaLabel="Add to cart" glyph="cart" />);
        expect(icon.getAttribute('aria-label')).toBe('Add to cart');
        expect(icon.getAttribute('role')).toBe('img');
        expect(icon.hasAttribute('aria-hidden')).toBe(false);
    });

    it('passes ariaHidden as aria-hidden; icons without a label are decorative', async () => {
        const { screen, icon } = await renderIcon(<Icon ariaHidden glyph="cart" />);
        expect(icon.getAttribute('aria-hidden')).toBe('true');

        await screen.rerender(<Icon glyph="cart" />);
        expect(icon.getAttribute('aria-hidden')).toBe('true');
        expect(icon.getAttribute('role')).toBe('presentation');

        // an explicit ariaHidden wins
        await screen.rerender(<Icon ariaHidden={false} glyph="cart" />);
        expect(icon.getAttribute('aria-hidden')).toBe('false');
    });

    it('spreads other props to the element', async () => {
        const { icon } = await renderIcon(<Icon ariaHidden data-sample="Sample" glyph="cart" />);
        expect(icon.getAttribute('data-sample')).toBe('Sample');
    });

    it('forwards the ref', async () => {
        const ref = createRef<HTMLElement>();
        await render(<Icon ariaHidden glyph="cart" ref={ref} />);
        expect(ref.current?.tagName).toBe('I');
        expect(ref.current?.dataset['glyph']).toBe(iconGlyphChar('cart'));
    });

    it('resolves glyph names of SAP-icons, TNT and Business Suite fonts; unknown glyph renders nothing', async () => {
        const { screen, icon } = await renderIcon(<Icon glyph="accept" />);
        expect(icon.dataset['glyph']).toBe(String.fromCodePoint(0xe05b));
        expect(before(icon).content).toBe(`"${String.fromCodePoint(0xe05b)}"`);
        expect(before(icon).fontFamily).toContain('SAP-icons');

        await screen.rerender(<Icon font="SAP-icons-TNT" glyph="actor" />);
        expect(icon.dataset['glyph']).toBe(String.fromCodePoint(0xe03c));
        expect(before(icon).fontFamily).toContain('SAP-icons-TNT');

        await screen.rerender(<Icon font="BusinessSuiteInAppSymbols" glyph="add-note" />);
        expect(icon.dataset['glyph']).toBe(String.fromCodePoint(0xe008));
        expect(before(icon).fontFamily).toContain('SAP-icons-Business-Suite');

        // a name of another font does not resolve
        await screen.rerender(<Icon font="BusinessSuiteInAppSymbols" glyph="accept" />);
        expect(icon.hasAttribute('data-glyph')).toBe(false);
        await screen.rerender(<Icon glyph="no-such-glyph" />);
        expect(icon.hasAttribute('data-glyph')).toBe(false);
        expect(before(icon).content).toBe('""');
        expect(iconGlyphChar('nope')).toBe('');
    });

    it('mirrored glyphs flip in RTL', async () => {
        const { screen, icon } = await renderIcon(<Icon glyph="arrow-left" />);
        expect(getComputedStyle(icon).scale).toBe('none');

        document.documentElement.dir = 'rtl';
        expect(getComputedStyle(icon).scale.startsWith('-1')).toBe(true);

        // glyphs without a mirrored form keep their direction
        await screen.rerender(<Icon glyph="accept" />);
        expect(getComputedStyle(icon).scale).toBe('none');
    });

    it('sizes s, m, l and xl; 1rem by default', async () => {
        const { screen, icon } = await renderIcon(<Icon glyph="cart" />);
        expect(getComputedStyle(icon).fontSize).toBe('16px');
        for (const [size, px] of [
            ['s', '12px'],
            ['m', '16px'],
            ['l', '20px'],
            ['xl', '24px']
        ] as const) {
            await screen.rerender(<Icon glyph="cart" size={size} />);
            expect(getComputedStyle(icon).fontSize, size).toBe(px);
        }
    });

    it('color and background variants', async () => {
        const inText = (icon: ReactNode) => <span style={{ color: 'rgb(1, 2, 3)' }}>{icon}</span>;
        const { screen, icon } = await renderIcon(inText(<Icon glyph="cart" />));
        // inherits the text colour by default
        expect(getComputedStyle(icon).color).toBe('rgb(1, 2, 3)');

        await screen.rerender(inText(<Icon color="negative" glyph="cart" />));
        expect(getComputedStyle(icon).color).toBe(resolve('--sapNegativeElementColor'));
        expect(getComputedStyle(icon).backgroundColor).toBe('rgba(0, 0, 0, 0)');

        // a background switches the glyph to the contrasting colour
        await screen.rerender(inText(<Icon background="positive" glyph="cart" />));
        expect(getComputedStyle(icon).backgroundColor).toBe(resolve('--sapPositiveElementColor'));
        expect(getComputedStyle(icon).color).toBe(resolve('--sapGroup_ContentBackground'));
    });
});
