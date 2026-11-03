/*
 * Port of fundamental-react (ButtonSegmented) with the visual design of fundamental-styles,
 * Copyright (c) SAP SE or an SAP affiliate company and fundamental-react contributors.
 * Modified for fundamental-ngx-registry: rewritten with React 19, TypeScript and Tailwind CSS.
 * SPDX-License-Identifier: Apache-2.0
 */
import type { ComponentPropsWithRef } from 'react';
import { cn } from '@/lib/utils';

export type SegmentedButtonProps = ComponentPropsWithRef<'div'>;

/**
 * Groups a series of buttons on a single line. Only one of the options is active at a time, like a radio button
 * group: mark it `selected` and give the group an `aria-label`.
 *
 * ```tsx
 * <SegmentedButton aria-label="View">
 *     <Button selected>List</Button>
 *     <Button selected={false}>Grid</Button>
 * </SegmentedButton>
 * ```
 */
export function SegmentedButton({ className, children, ...props }: SegmentedButtonProps) {
    return (
        <div
            role="group"
            {...props}
            className={cn(
                'relative box-border inline-flex w-fit align-middle [&>button]:m-0 [&>button:hover]:z-[1]',
                // Horizon: transparent buttons on a pad; high contrast: joined bordered buttons
                'rounded-sap-button-border-corner-radius bg-sap-button-background',
                '[--seg-bw:var(--sapButton_BorderWidth)] [--seg-bc:var(--sapButton_BorderColor)] shadow-[inset_0_0_0_var(--seg-bw)_var(--seg-bc)]',
                '[&>button]:border-transparent [&>button]:bg-transparent hc:[&>button]:border-sap-button-border-color hc:[&>button]:bg-sap-button-background',
                '[&>button:not(:last-of-type)]:rounded-e-sap-button-segment-border-corner-radius [&>button:not(:first-of-type)]:rounded-s-sap-button-segment-border-corner-radius',
                'hc:[&>button:not(:last-of-type)]:-me-(--sapButton_BorderWidth)',
                className
            )}
        >
            {children}
        </div>
    );
}
