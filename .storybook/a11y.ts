interface A11yRule {
    id: string;
    enabled?: boolean;
}

/**
 * Stories turn off colour contrast where Horizon's own colours are below 4.5:1 by design; the high-contrast
 * themes are made for that check, so it runs there in any case.
 */
export function contrastInHighContrast(theme: string, parameters: Record<string, any>): void {
    const config = parameters['a11y']?.config;
    if (!theme.includes('_hc') || !config?.rules) return;
    config.rules = (config.rules as A11yRule[]).filter((rule) => rule.id !== 'color-contrast');
}
