/** Theme, density and direction toolbars, shared by the Storybooks of every framework. */

export const THEMES = {
    sap_horizon: 'Horizon',
    sap_horizon_dark: 'Horizon Dark',
    sap_horizon_hcb: 'Horizon HC Black',
    sap_horizon_hcw: 'Horizon HC White'
} as const;

export const globalTypes = {
    theme: {
        description: 'SAP theme',
        toolbar: {
            title: 'Theme',
            icon: 'paintbrush' as const,
            items: Object.entries(THEMES).map(([value, title]) => ({ value, title })),
            dynamicTitle: true
        }
    },
    density: {
        description: 'Content density',
        toolbar: {
            title: 'Density',
            icon: 'component' as const,
            items: [
                { value: 'cozy', title: 'Cozy' },
                { value: 'compact', title: 'Compact' }
            ],
            dynamicTitle: true
        }
    },
    dir: {
        description: 'Text direction',
        toolbar: {
            title: 'Direction',
            icon: 'transfer' as const,
            items: [
                { value: 'ltr', title: 'LTR' },
                { value: 'rtl', title: 'RTL' }
            ],
            dynamicTitle: true
        }
    }
};

export const initialGlobals = {
    theme: 'sap_horizon',
    density: 'cozy',
    dir: 'ltr'
};

export const parameters = {
    layout: 'fullscreen',
    controls: {
        expanded: true,
        matchers: { color: /(background|color)$/i }
    },
    backgrounds: { disable: true },
    a11y: { test: 'todo' }
};

/** Applies theme, density and direction to <html>, so overlays attached to <body> follow them too. */
export function applyFoundation(globals: Record<string, unknown>): void {
    const { theme, density, dir } = globals;
    const html = document.documentElement;
    html.setAttribute('data-sap-theme', (theme as string | undefined) ?? 'sap_horizon');
    html.setAttribute('dir', (dir as string | undefined) ?? 'ltr');
    if (density === 'compact') {
        html.setAttribute('data-density', 'compact');
    } else {
        html.removeAttribute('data-density');
    }
}
