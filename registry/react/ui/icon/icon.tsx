/*
 * Port of fundamental-react (Icon) with the visual design of fundamental-styles,
 * Copyright (c) SAP SE or an SAP affiliate company and fundamental-react contributors.
 * Modified for fundamental-ngx-registry: rewritten with React 19, TypeScript and Tailwind CSS.
 * SPDX-License-Identifier: Apache-2.0
 */
import type { ComponentPropsWithRef } from 'react';
import { cn, cva, type VariantProps } from '@/lib/utils';
import { SAP_ICONS, SAP_ICONS_BUSINESS_SUITE, SAP_ICONS_TNT, type IconGlyph } from './icon-glyphs';

export type IconFont = 'SAP-icons' | 'BusinessSuiteInAppSymbols' | 'SAP-icons-TNT';

const GLYPHS: Record<IconFont, Readonly<Record<string, IconGlyph>>> = {
    'SAP-icons': SAP_ICONS,
    BusinessSuiteInAppSymbols: SAP_ICONS_BUSINESS_SUITE,
    'SAP-icons-TNT': SAP_ICONS_TNT
};

export const iconVariants = cva(
    'inline-flex shrink-0 items-center justify-center not-italic font-normal leading-none normal-case no-underline ' +
        'before:content-[attr(data-glyph)] before:text-center before:[text-rendering:optimizeLegibility]',
    {
        variants: {
            font: {
                'SAP-icons': 'before:font-sap-content-icon-font-family',
                BusinessSuiteInAppSymbols: "before:font-['SAP-icons-Business-Suite']",
                'SAP-icons-TNT': "before:font-['SAP-icons-TNT']"
            },
            size: {
                default: 'text-[1rem]',
                s: 'text-[0.75rem]',
                m: 'text-[1rem]',
                l: 'text-[1.25rem]',
                xl: 'text-[1.5rem]'
            },
            color: {
                inherit: 'text-inherit',
                default: 'text-sap-content-icon-color',
                contrast: 'text-sap-content-contrast-icon-color',
                'non-interactive': 'text-sap-content-non-interactive-icon-color',
                tile: 'text-sap-tile-icon-color',
                marker: 'text-sap-content-marker-icon-color',
                critical: 'text-sap-critical-element-color',
                negative: 'text-sap-negative-element-color',
                neutral: 'text-sap-neutral-element-color',
                positive: 'text-sap-positive-element-color',
                information: 'text-sap-informative-element-color'
            },
            background: {
                none: '',
                default: 'text-sap-group-content-background bg-sap-content-icon-color',
                contrast: 'text-sap-content-icon-color bg-sap-group-content-background',
                'non-interactive': 'text-sap-group-content-background bg-sap-content-non-interactive-icon-color',
                tile: 'text-sap-group-content-background bg-sap-tile-icon-color',
                marker: 'text-sap-group-content-background bg-sap-content-marker-icon-color',
                critical: 'text-sap-group-content-background bg-sap-critical-element-color',
                negative: 'text-sap-group-content-background bg-sap-negative-element-color',
                neutral: 'text-sap-group-content-background bg-sap-neutral-element-color',
                positive: 'text-sap-group-content-background bg-sap-positive-element-color',
                information: 'text-sap-group-content-background bg-sap-informative-element-color'
            },
            mirrored: {
                true: 'rtl:-scale-x-100',
                false: ''
            }
        },
        defaultVariants: { font: 'SAP-icons', size: 'default', color: 'inherit', background: 'none', mirrored: false }
    }
);

type IconVariants = VariantProps<typeof iconVariants>;
export type IconSize = Exclude<IconVariants['size'], null | undefined | 'default'>;
export type IconColor = Exclude<IconVariants['color'], null | undefined>;
export type IconBackground = Exclude<IconVariants['background'], null | undefined>;

/** Resolves a glyph name of an SAP icon font to its character, or '' if the font has no such glyph. */
export function iconGlyphChar(glyph: string | null | undefined, font: IconFont = 'SAP-icons'): string {
    const entry = glyph ? GLYPHS[font][glyph] : undefined;
    if (entry === undefined) return '';
    return String.fromCodePoint(typeof entry === 'number' ? entry : entry[0]);
}

export interface IconProps extends Omit<ComponentPropsWithRef<'i'>, 'children' | 'color'> {
    /** Name of the glyph, e.g. "cart". See the "All SAP-icons" story for the full list. */
    glyph: string;
    /** Icon font the glyph comes from. */
    font?: IconFont;
    /** Size of the icon: s 0.75rem, m 1rem, l 1.25rem, xl 1.5rem. 1rem when not set. */
    size?: IconSize;
    /** Semantic icon colour. Inherits the text colour by default. */
    color?: IconColor;
    /** Semantic background colour; also switches the glyph to the contrasting colour. */
    background?: IconBackground;
    /**
     * Text to describe the icon, placed in `aria-label`. A labelled icon is an image for assistive technology; one
     * without a label is decorative and hidden from it.
     */
    ariaLabel?: string;
    /** The value of `aria-hidden`. Overrides the default: hidden unless the icon has an `ariaLabel`. */
    ariaHidden?: boolean;
}

/**
 * An icon from the SAP icon fonts. Icons save space and give visual clarity and focus.
 *
 * ```tsx
 * <Icon glyph="cart" />
 * <Icon glyph="alert" ariaLabel="Warning" color="critical" />
 * ```
 */
export function Icon({
    glyph,
    font = 'SAP-icons',
    size,
    color,
    background,
    ariaLabel,
    ariaHidden,
    className,
    ...props
}: IconProps) {
    const char = iconGlyphChar(glyph, font);
    return (
        <i
            {...props}
            aria-hidden={ariaHidden ?? (ariaLabel ? undefined : true)}
            aria-label={ariaLabel}
            className={cn(
                iconVariants({ font, size, color, background, mirrored: Array.isArray(GLYPHS[font][glyph]) }),
                className
            )}
            data-glyph={char || undefined}
            role={ariaLabel ? 'img' : 'presentation'}
        />
    );
}
