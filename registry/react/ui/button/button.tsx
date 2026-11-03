/*
 * Port of fundamental-react (Button) with the visual design of fundamental-styles,
 * Copyright (c) SAP SE or an SAP affiliate company and fundamental-react contributors.
 * Modified for fundamental-ngx-registry: rewritten with React 19, TypeScript and Tailwind CSS.
 * SPDX-License-Identifier: Apache-2.0
 */
import { useId, type ComponentPropsWithRef, type MouseEventHandler } from 'react';
import { cn, cva, type VariantProps } from '@/lib/utils';
import { Icon, type IconProps } from '@/ui/icon/icon';

export const buttonVariants = cva(
    [
        'relative box-border inline-flex items-center justify-center gap-1.5 align-middle',
        'h-sap-element-height max-h-sap-element-height min-w-9 px-[calc(0.625rem_-_var(--sapButton_BorderWidth))]',
        'compact:h-sap-element-compact-height compact:max-h-sap-element-compact-height compact:min-w-8 compact:px-[calc(0.5rem_-_var(--sapButton_BorderWidth))]',
        'rounded-sap-button-border-corner-radius border-solid border-width-sap-button-border-width',
        'text-sap-font-size leading-[normal] text-center whitespace-nowrap no-underline select-none cursor-pointer appearance-none outline-0 [forced-color-adjust:none]',
        // extended touch area: 2.75rem cozy, 2rem compact
        "before:absolute before:inset-x-0 before:-inset-y-[calc((2.75rem_-_var(--sapElement_Height))/2)] before:content-['']",
        'compact:before:-inset-y-[calc((2rem_-_var(--sapElement_Compact_Height))/2)]',
        // SAP focus indicator: an inner rounded frame
        "focus:z-[5] focus:after:pointer-events-none focus:after:absolute focus:after:inset-(--sapButton_BorderWidth) focus:after:content-['']",
        'focus:after:rounded-[calc(var(--sapButton_BorderCornerRadius)_-_var(--sapContent_FocusWidth))]',
        'focus:after:border-(length:--sapContent_FocusWidth) focus:after:[border-style:var(--sapContent_FocusStyle)] focus:after:border-sap-content-focus-color',
        'disabled:cursor-not-allowed disabled:opacity-(--sapContent_DisabledOpacity) disabled:shadow-none',
        'aria-disabled:cursor-not-allowed aria-disabled:opacity-(--sapContent_DisabledOpacity) aria-disabled:shadow-none'
    ],
    {
        variants: {
            variant: {
                standard: [
                    'font-sap-button-font-family bg-sap-button-background border-sap-button-border-color text-sap-button-text-color',
                    'enabled-hover:bg-sap-button-hover-background enabled-hover:border-sap-button-hover-border-color enabled-hover:text-sap-button-hover-text-color',
                    'enabled-active:bg-sap-button-active-background enabled-active:border-sap-button-active-border-color enabled-active:text-sap-button-active-text-color',
                    'toggled:bg-sap-button-selected-background toggled:border-sap-button-selected-border-color toggled:text-sap-button-selected-text-color',
                    'toggled:enabled-hover:bg-sap-button-selected-hover-background toggled:enabled-hover:border-sap-button-selected-hover-border-color toggled:enabled-hover:text-sap-button-selected-text-color',
                    'toggled:enabled-active:bg-sap-button-selected-hover-background toggled:enabled-active:border-sap-button-selected-hover-border-color toggled:enabled-active:text-sap-button-selected-text-color'
                ],
                emphasized: [
                    'font-sap-button-emphasized-font-family border-width-sap-button-emphasized-border-width',
                    'bg-sap-button-emphasized-background border-sap-button-emphasized-border-color text-sap-button-emphasized-text-color',
                    'enabled-hover:bg-sap-button-emphasized-hover-background enabled-hover:border-sap-button-emphasized-hover-border-color enabled-hover:text-sap-button-emphasized-hover-text-color',
                    'enabled-active:bg-sap-button-emphasized-active-background enabled-active:border-sap-button-emphasized-active-border-color enabled-active:text-sap-button-emphasized-active-text-color',
                    'toggled:bg-sap-button-selected-background toggled:border-sap-button-selected-border-color toggled:text-sap-button-selected-text-color',
                    'toggled:enabled-hover:bg-sap-button-selected-hover-background toggled:enabled-hover:border-sap-button-selected-hover-border-color toggled:enabled-hover:text-sap-button-selected-text-color',
                    'toggled:enabled-active:bg-sap-button-selected-hover-background toggled:enabled-active:border-sap-button-selected-hover-border-color toggled:enabled-active:text-sap-button-selected-text-color',
                    'focus:after:border-sap-content-contrast-focus-color focus:enabled-active:after:border-sap-content-focus-color',
                    'toggled:focus:after:border-sap-content-focus-color compact:focus:enabled-active:after:border-transparent'
                ],
                ghost: [
                    'font-sap-button-font-family bg-sap-button-background border-sap-button-border-color text-sap-button-text-color',
                    'enabled-hover:bg-sap-button-hover-background enabled-hover:border-sap-button-hover-border-color enabled-hover:text-sap-button-hover-text-color',
                    'enabled-active:bg-sap-button-active-background enabled-active:border-sap-button-active-border-color enabled-active:text-sap-button-active-text-color',
                    'toggled:bg-sap-button-selected-background toggled:border-sap-button-selected-border-color toggled:text-sap-button-selected-text-color',
                    'toggled:enabled-hover:bg-sap-button-selected-hover-background toggled:enabled-hover:border-sap-button-selected-hover-border-color toggled:enabled-hover:text-sap-button-selected-text-color',
                    'toggled:enabled-active:bg-sap-button-selected-hover-background toggled:enabled-active:border-sap-button-selected-hover-border-color toggled:enabled-active:text-sap-button-selected-text-color'
                ],
                positive: [
                    'font-sap-button-font-family bg-sap-button-accept-background border-sap-button-accept-border-color text-sap-button-accept-text-color',
                    'enabled-hover:bg-sap-button-accept-hover-background enabled-hover:border-sap-button-accept-hover-border-color enabled-hover:text-sap-button-accept-hover-text-color',
                    'enabled-active:bg-sap-button-accept-active-background enabled-active:border-sap-button-accept-active-border-color enabled-active:text-sap-button-accept-active-text-color',
                    'toggled:bg-sap-button-accept-selected-background toggled:border-sap-button-accept-selected-border-color toggled:text-sap-button-accept-selected-text-color',
                    'toggled:enabled-hover:bg-sap-button-accept-selected-hover-background toggled:enabled-hover:border-sap-button-accept-selected-hover-border-color toggled:enabled-hover:text-sap-button-accept-selected-text-color',
                    'toggled:enabled-active:bg-sap-button-accept-selected-hover-background toggled:enabled-active:border-sap-button-accept-selected-hover-border-color toggled:enabled-active:text-sap-button-accept-selected-text-color'
                ],
                negative: [
                    'font-sap-button-font-family bg-sap-button-reject-background border-sap-button-reject-border-color text-sap-button-reject-text-color',
                    'enabled-hover:bg-sap-button-reject-hover-background enabled-hover:border-sap-button-reject-hover-border-color enabled-hover:text-sap-button-reject-hover-text-color',
                    'enabled-active:bg-sap-button-reject-active-background enabled-active:border-sap-button-reject-active-border-color enabled-active:text-sap-button-reject-active-text-color',
                    'toggled:bg-sap-button-reject-selected-background toggled:border-sap-button-reject-selected-border-color toggled:text-sap-button-reject-selected-text-color',
                    'toggled:enabled-hover:bg-sap-button-reject-selected-hover-background toggled:enabled-hover:border-sap-button-reject-selected-hover-border-color toggled:enabled-hover:text-sap-button-reject-selected-text-color',
                    'toggled:enabled-active:bg-sap-button-reject-selected-hover-background toggled:enabled-active:border-sap-button-reject-selected-hover-border-color toggled:enabled-active:text-sap-button-reject-selected-text-color'
                ],
                attention: [
                    'font-sap-button-font-family bg-sap-button-attention-background border-sap-button-attention-border-color text-sap-button-attention-text-color',
                    'enabled-hover:bg-sap-button-attention-hover-background enabled-hover:border-sap-button-attention-hover-border-color enabled-hover:text-sap-button-attention-hover-text-color',
                    'enabled-active:bg-sap-button-attention-active-background enabled-active:border-sap-button-attention-active-border-color enabled-active:text-sap-button-attention-active-text-color',
                    'toggled:bg-sap-button-attention-selected-background toggled:border-sap-button-attention-selected-border-color toggled:text-sap-button-attention-selected-text-color',
                    'toggled:enabled-hover:bg-sap-button-attention-selected-hover-background toggled:enabled-hover:border-sap-button-attention-selected-hover-border-color toggled:enabled-hover:text-sap-button-attention-selected-text-color',
                    'toggled:enabled-active:bg-sap-button-attention-selected-hover-background toggled:enabled-active:border-sap-button-attention-selected-hover-border-color toggled:enabled-active:text-sap-button-attention-selected-text-color'
                ],
                transparent: [
                    'font-sap-button-font-family bg-sap-button-lite-background border-sap-button-lite-border-color text-sap-button-lite-text-color',
                    'enabled-hover:bg-sap-button-lite-hover-background enabled-hover:border-sap-button-lite-hover-border-color enabled-hover:text-sap-button-lite-hover-text-color',
                    'enabled-active:bg-sap-button-lite-active-background enabled-active:border-sap-button-lite-active-border-color enabled-active:text-sap-button-active-text-color',
                    'toggled:bg-sap-button-selected-background toggled:border-sap-button-selected-border-color toggled:text-sap-button-selected-text-color',
                    'toggled:enabled-hover:bg-sap-button-selected-hover-background toggled:enabled-hover:border-sap-button-selected-hover-border-color toggled:enabled-hover:text-sap-button-selected-text-color',
                    'toggled:enabled-active:bg-sap-button-selected-hover-background toggled:enabled-active:border-sap-button-selected-hover-border-color toggled:enabled-active:text-sap-button-selected-text-color'
                ]
            }
        },
        defaultVariants: { variant: 'standard' }
    }
);

export type ButtonVariant = Exclude<VariantProps<typeof buttonVariants>['variant'], null | undefined>;

/** Importance of the button. */
export type ButtonOption = Extract<ButtonVariant, 'emphasized' | 'transparent'>;

/** Semantic type of the button. */
export type ButtonType = Extract<ButtonVariant, 'standard' | 'positive' | 'negative' | 'ghost' | 'attention'>;

export interface ButtonProps extends Omit<ComponentPropsWithRef<'button'>, 'type'> {
    /** Importance: `emphasized` for the one primary action of a page, `transparent` for the least important. */
    option?: ButtonOption;
    /** Semantic type: `standard`, `positive`, `negative`, `ghost` or `attention`. `option` wins over it. */
    type?: ButtonType;
    /** Compact size, for desktop apps; the same as `data-density="compact"` on a container. */
    compact?: boolean;
    /** Selected state of a toggle button, exposed as `aria-pressed`. Leave it unset for a plain button. */
    selected?: boolean;
    /** Name of an SAP icon shown in the button. Icon-only buttons need an `aria-label`. */
    glyph?: string;
    /** Puts the icon before the text; it goes after the text by default. */
    iconBeforeText?: boolean;
    /** Additional props of the icon. */
    iconProps?: Partial<IconProps>;
    /** Content of a badge, 1 to 4 characters. Recommended on emphasized, standard and transparent buttons. */
    badge?: string;
    /** CSS class(es) of the badge. */
    badgeClassName?: string;
    /** CSS class(es) of the text. */
    textClassName?: string;
    /**
     * Keeps a disabled button focusable, so that screen reader users can reach it and hear why it is disabled. It is
     * then disabled through `aria-disabled` and ignores clicks. Give it a `disabledMessage` and an `enabledMessage`.
     */
    allowFocusOnDisable?: boolean;
    /** With `allowFocusOnDisable`: announced while the button is disabled, e.g. how to enable it. */
    disabledMessage?: string;
    /** With `allowFocusOnDisable`: announced when the button becomes enabled. */
    enabledMessage?: string;
    /** Value of the `type` attribute of the `<button>`. */
    typeAttr?: 'button' | 'submit' | 'reset';
}

/**
 * A button performs an action. Use the emphasized option only once within a page or dialog, and the negative type
 * only for actions that are potentially destructive.
 *
 * ```tsx
 * <Button option="emphasized" onClick={save}>Save</Button>
 * <Button glyph="cart" aria-label="Add to cart" />
 * ```
 */
export function Button({
    option,
    type,
    compact,
    selected,
    glyph,
    iconBeforeText,
    iconProps,
    badge,
    badgeClassName,
    textClassName,
    allowFocusOnDisable,
    disabledMessage,
    enabledMessage,
    typeAttr = 'button',
    disabled,
    onClick,
    children,
    className,
    ...props
}: ButtonProps) {
    const instructionsId = useId();
    const ariaDisabled = props['aria-disabled'];
    const disabledInAnyWay = !!disabled || ariaDisabled === true || ariaDisabled === 'true';

    // a disabled button that keeps the focus ignores clicks
    const handleClick: MouseEventHandler<HTMLButtonElement> | undefined =
        allowFocusOnDisable && disabledInAnyWay ? undefined : onClick;

    const disabledProps = allowFocusOnDisable
        ? { 'aria-disabled': disabledInAnyWay, 'aria-describedby': instructionsId }
        : { disabled: disabledInAnyWay };

    const icon = glyph ? <Icon {...iconProps} ariaHidden glyph={glyph} /> : null;

    return (
        <>
            <button
                {...props}
                {...disabledProps}
                aria-pressed={selected}
                className={cn(buttonVariants({ variant: option ?? type ?? 'standard' }), className)}
                data-density={compact ? 'compact' : undefined}
                onClick={handleClick}
                type={typeAttr}
            >
                {iconBeforeText && icon}
                {children != null && children !== false && (
                    <span className={cn('truncate font-[inherit] text-inherit', textClassName)}>{children}</span>
                )}
                {!iconBeforeText && icon}
                {badge && (
                    <span
                        className={cn(
                            'z-[1] box-border inline-flex items-center justify-center whitespace-nowrap',
                            'absolute -top-[0.3125rem] -end-[0.3125rem] h-4 px-[0.3125rem] rounded-lg',
                            'border border-solid border-sap-content-badge-border-color bg-sap-content-badge-background',
                            'font-sap-font-family text-sap-font-small-size text-sap-content-badge-text-color leading-[normal]',
                            'compact:static compact:ms-1',
                            badgeClassName
                        )}
                    >
                        {badge}
                    </span>
                )}
            </button>
            {allowFocusOnDisable && (
                <p aria-live="assertive" className="sr-only-sap" id={instructionsId}>
                    {disabledInAnyWay ? disabledMessage : enabledMessage}
                </p>
            )}
        </>
    );
}
