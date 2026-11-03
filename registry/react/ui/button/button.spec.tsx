import { createRef, useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { Button, type ButtonOption, type ButtonType } from './button';

/** The computed colour of a theme variable, to compare with the button's colours. */
function resolve(variable: string): string {
    const probe = document.createElement('span');
    probe.style.color = `var(${variable})`;
    document.body.appendChild(probe);
    const color = getComputedStyle(probe).color;
    probe.remove();
    return color;
}

describe('Button', () => {
    afterEach(() => document.documentElement.removeAttribute('data-density'));

    it('spreads other props to the button', async () => {
        const screen = await render(<Button data-sample="Sample" />);
        expect(screen.container.querySelector('button')!.getAttribute('data-sample')).toBe('Sample');
    });

    it('adds textClassName to the text', async () => {
        const screen = await render(<Button textClassName="wonderful-styles">Button</Button>);
        const text = screen.getByText('Button').element();
        expect(text.tagName).toBe('SPAN');
        expect(text.classList).toContain('wonderful-styles');
    });

    it('spreads iconProps to the icon', async () => {
        const screen = await render(
            <Button glyph="bell" iconProps={{ 'data-sample': 'Sample' } as object}>
                Button
            </Button>
        );
        expect(screen.container.querySelector('i')!.getAttribute('data-sample')).toBe('Sample');
    });

    it('forwards the ref', async () => {
        const ref = createRef<HTMLButtonElement>();
        await render(<Button ref={ref}>Button</Button>);
        expect(ref.current?.tagName).toBe('BUTTON');
        expect(ref.current?.textContent).toBe('Button');
    });

    it('renders the icon after the text, or before it with iconBeforeText', async () => {
        const screen = await render(<Button glyph="bell">Button</Button>);
        const button = screen.getByRole('button').element();
        const icon = () => button.querySelector('i')!;
        const text = button.querySelector('span')!;
        expect(button.lastElementChild).toBe(icon());
        expect(icon().getBoundingClientRect().left).toBeGreaterThanOrEqual(text.getBoundingClientRect().right);
        // the icon is decorative: the text names the button
        expect(icon().getAttribute('aria-hidden')).toBe('true');

        await screen.rerender(
            <Button glyph="bell" iconBeforeText>
                Button
            </Button>
        );
        expect(button.firstElementChild).toBe(icon());
        expect(icon().getBoundingClientRect().right).toBeLessThanOrEqual(text.getBoundingClientRect().left);
    });

    it('icon-only buttons are named by aria-label and square', async () => {
        await render(<Button aria-label="Add to cart" glyph="cart" />);
        const button = page.getByRole('button', { name: 'Add to cart' });
        await expect.element(button).toBeInTheDocument();
        expect(button.element().textContent).toBe('');
        const rect = button.element().getBoundingClientRect();
        expect(rect.width).toBe(rect.height);
    });

    it('options and types use their theme colours at rest, on hover, selected and disabled', async () => {
        const variants: [{ option?: ButtonOption; type?: ButtonType }, string, string, string][] = [
            [{}, 'Button', 'Button_Hover', 'Button_Selected'],
            [{ type: 'standard' }, 'Button', 'Button_Hover', 'Button_Selected'],
            [{ option: 'emphasized' }, 'Button_Emphasized', 'Button_Emphasized_Hover', 'Button_Selected'],
            [{ option: 'transparent' }, 'Button_Lite', 'Button_Lite_Hover', 'Button_Selected'],
            [{ type: 'positive' }, 'Button_Accept', 'Button_Accept_Hover', 'Button_Accept_Selected'],
            [{ type: 'negative' }, 'Button_Reject', 'Button_Reject_Hover', 'Button_Reject_Selected'],
            [{ type: 'attention' }, 'Button_Attention', 'Button_Attention_Hover', 'Button_Attention_Selected'],
            [{ type: 'ghost' }, 'Button', 'Button_Hover', 'Button_Selected'],
            // the option wins over the type
            [
                { option: 'emphasized', type: 'negative' },
                'Button_Emphasized',
                'Button_Emphasized_Hover',
                'Button_Selected'
            ]
        ];
        const ui = (props: object) => (
            <>
                <Button {...props}>Button</Button>
                <span>elsewhere</span>
            </>
        );
        const screen = await render(ui({}));
        const button = screen.getByRole('button').element() as HTMLButtonElement;
        const elsewhere = screen.getByText('elsewhere');
        const bg = () => getComputedStyle(button).backgroundColor;
        for (const [props, rest, hover, selected] of variants) {
            const name = JSON.stringify(props);
            await screen.rerender(ui(props));
            expect(bg(), name).toBe(resolve(`--sap${rest}_Background`));
            await userEvent.hover(button);
            expect(bg(), `${name} hover`).toBe(resolve(`--sap${hover}_Background`));
            await userEvent.hover(elsewhere);

            await screen.rerender(ui({ ...props, selected: true }));
            expect(bg(), `${name} selected`).toBe(resolve(`--sap${selected}_Background`));

            // disabled: rest colours at reduced opacity, no hover colours
            await screen.rerender(ui({ ...props, disabled: true }));
            expect(getComputedStyle(button).opacity).toBe('0.4');
            expect(getComputedStyle(button).cursor).toBe('not-allowed');
            await userEvent.hover(button, { force: true });
            expect(bg(), `${name} disabled hover`).toBe(resolve(`--sap${rest}_Background`));
            await userEvent.hover(elsewhere);
        }
        await screen.rerender(ui({ option: 'emphasized' }));
        expect(getComputedStyle(button).color).toBe(resolve('--sapButton_Emphasized_TextColor'));
    });

    it('selected sets aria-pressed; a plain button has none', async () => {
        const screen = await render(<Button>Bold</Button>);
        const button = screen.getByRole('button').element();
        expect(button.hasAttribute('aria-pressed')).toBe(false);
        await screen.rerender(<Button selected={false}>Bold</Button>);
        expect(button.getAttribute('aria-pressed')).toBe('false');
        await screen.rerender(<Button selected>Bold</Button>);
        expect(button.getAttribute('aria-pressed')).toBe('true');
        await expect.element(page.getByRole('button', { name: 'Bold', pressed: true })).toBeInTheDocument();
    });

    it('disabled buttons are out of the tab order and ignore clicks', async () => {
        const onClick = vi.fn();
        const screen = await render(
            <Button disabled onClick={onClick}>
                Save
            </Button>
        );
        const button = screen.getByRole('button').element() as HTMLButtonElement;
        expect(button.disabled).toBe(true);
        await userEvent.click(button, { force: true });
        expect(onClick).not.toHaveBeenCalled();
        // no instructions without allowFocusOnDisable
        expect(button.hasAttribute('aria-describedby')).toBe(false);
        expect(screen.container.querySelector('p')).toBeNull();
    });

    it('allowFocusOnDisable keeps a disabled button focusable, ignores clicks and describes it', async () => {
        const onClick = vi.fn();
        function Host() {
            const [disabled, setDisabled] = useState(true);
            return (
                <>
                    <Button
                        allowFocusOnDisable
                        disabled={disabled}
                        disabledMessage="Complete the required fields to submit."
                        enabledMessage="The form can be submitted now."
                        onClick={onClick}
                    >
                        Submit
                    </Button>
                    <input aria-label="Toggle" onChange={() => setDisabled(!disabled)} type="checkbox" />
                </>
            );
        }
        const screen = await render(<Host />);
        const button = screen.getByRole('button').element() as HTMLButtonElement;
        const instructions = screen.container.querySelector('p')!;

        expect(button.disabled).toBe(false);
        expect(button.getAttribute('aria-disabled')).toBe('true');
        expect(instructions.id).not.toBe('');
        expect(button.getAttribute('aria-describedby')).toBe(instructions.id);
        expect(instructions.getAttribute('aria-live')).toBe('assertive');
        expect(instructions.textContent).toBe('Complete the required fields to submit.');
        await expect
            .element(page.getByRole('button', { name: 'Submit' }))
            .toHaveAccessibleDescription('Complete the required fields to submit.');
        // visually hidden
        expect(instructions.getBoundingClientRect().width).toBeLessThanOrEqual(1);

        await userEvent.keyboard('{Tab}');
        expect(document.activeElement).toBe(button);
        // Playwright treats aria-disabled elements as not clickable
        await userEvent.click(button, { force: true });
        await userEvent.keyboard('{Enter}');
        expect(onClick).not.toHaveBeenCalled();
        expect(getComputedStyle(button).opacity).toBe('0.4');

        // enabled: the new state is announced and clicks go through
        await userEvent.click(screen.getByRole('checkbox'));
        expect(button.getAttribute('aria-disabled')).toBe('false');
        expect(instructions.textContent).toBe('The form can be submitted now.');
        await userEvent.click(button);
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('typeAttr defaults to "button", so the button does not submit its form', async () => {
        const onSubmit = vi.fn((event: Event) => event.preventDefault());
        const screen = await render(
            <form onSubmit={(event) => onSubmit(event.nativeEvent)}>
                <Button>Plain</Button>
                <Button typeAttr="submit">Send</Button>
            </form>
        );
        expect(screen.getByRole('button', { name: 'Plain' }).element().getAttribute('type')).toBe('button');
        await userEvent.click(screen.getByRole('button', { name: 'Plain' }));
        expect(onSubmit).not.toHaveBeenCalled();
        await userEvent.click(screen.getByRole('button', { name: 'Send' }));
        expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    it('badge sits at the top-end corner; compact moves it inline', async () => {
        const screen = await render(
            <Button badge="12" badgeClassName="custom-badge">
                Inbox
            </Button>
        );
        const button = screen.getByRole('button').element();
        const badge = screen.getByText('12').element() as HTMLElement;
        expect(badge.classList).toContain('custom-badge');
        const b = button.getBoundingClientRect();
        const r = badge.getBoundingClientRect();
        expect(r.top).toBeLessThan(b.top);
        expect(r.right).toBeGreaterThan(b.right);
        expect(r.height).toBe(16);
        await expect.element(page.getByRole('button', { name: 'Inbox 12' })).toBeInTheDocument();

        await screen.rerender(
            <Button badge="12" compact>
                Inbox
            </Button>
        );
        expect(getComputedStyle(badge).position).toBe('static');
    });

    it('compact shrinks the height, like compact density on a container', async () => {
        const screen = await render(<Button>Button</Button>);
        const button = screen.getByRole('button').element();
        expect(button.getBoundingClientRect().height).toBe(36);
        await screen.rerender(<Button compact>Button</Button>);
        expect(button.getAttribute('data-density')).toBe('compact');
        expect(button.getBoundingClientRect().height).toBe(26);

        await screen.rerender(<Button>Button</Button>);
        document.documentElement.setAttribute('data-density', 'compact');
        expect(button.getBoundingClientRect().height).toBe(26);
    });
});
