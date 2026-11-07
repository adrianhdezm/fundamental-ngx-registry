/**
 * Visual cases for scripts/visual.mjs: an element of one of our stories (`ours`) and the matching element of a
 * fundamental-styles story (`ref`), compared in all 16 combinations of theme, density and direction.
 *
 *   label     name in the report
 *   ours      { story: Storybook story id, selector: Playwright selector of the element }
 *   ref       the same for https://sap.github.io/fundamental-styles/
 *   hover     hover the element before capturing
 *   pixels    false: compare computed styles only (e.g. when the texts differ)
 *   ignore    computed style properties (or "width") not to compare, with the reason in a comment
 */
const FS = 'sap-design-components-';

export const CASES = {
    icon: [
        {
            label: 'size md',
            ours: { story: 'components-icon--sizes', selector: 'span[data-glyph] >> nth=1' },
            ref: { story: `${FS}icons-sap-icons--sizes`, selector: '.sap-icon >> nth=1' }
        },
        {
            label: 'size xxl',
            ours: { story: 'components-icon--sizes', selector: 'span[data-glyph] >> nth=4' },
            ref: { story: `${FS}icons-sap-icons--sizes`, selector: '.sap-icon >> nth=4' }
        },
        {
            label: 'narrow glyph',
            ours: { story: 'components-icon--rtl', selector: 'span[data-glyph] >> nth=0' },
            ref: { story: `${FS}icons-sap-icons--sizes`, selector: '.sap-icon >> nth=1' },
            // a different glyph: only the box is compared
            pixels: false,
            ignore: ['height', 'font-size', 'line-height', 'color']
        },
        {
            label: 'color default',
            ours: { story: 'components-icon--colors', selector: 'span[data-glyph] >> nth=0' },
            ref: { story: `${FS}icons-sap-icons--colors`, selector: '.sap-icon--color-default' }
        },
        {
            label: 'color negative',
            ours: { story: 'components-icon--colors', selector: 'span[data-glyph] >> nth=6' },
            ref: { story: `${FS}icons-sap-icons--colors`, selector: '.sap-icon--color-negative' }
        },
        {
            label: 'color information',
            ours: { story: 'components-icon--colors', selector: 'span[data-glyph] >> nth=9' },
            ref: { story: `${FS}icons-sap-icons--colors`, selector: '.sap-icon--color-information' }
        }
    ],
    button: [
        ...[
            ['default', 'Options', 'button >> nth=1', 'button.fd-button >> nth=0'],
            ['emphasized', 'Options', 'button >> nth=0', '.fd-button--emphasized'],
            ['transparent', 'Options', 'button >> nth=2', '.fd-button--transparent'],
            ['ghost', 'Types', 'button:has-text("Ghost Button")', '.fd-button--ghost'],
            ['positive', 'Types', 'button:has-text("Positive Button")', '.fd-button--positive'],
            ['negative', 'Types', 'button:has-text("Negative Button")', '.fd-button--negative'],
            ['attention', 'Types', 'button:has-text("Attention Button")', '.fd-button--attention']
        ].map(([label, story, ours, ref]) => ({
            label,
            ours: { story: `components-button--${story.toLowerCase()}`, selector: ours },
            ref: { story: `${FS}buttons-button--styles`, selector: ref }
        })),
        {
            label: 'default hover',
            hover: true,
            ours: { story: 'components-button--options', selector: 'button >> nth=1' },
            ref: { story: `${FS}buttons-button--styles`, selector: 'button.fd-button >> nth=0' }
        },
        {
            label: 'emphasized hover',
            hover: true,
            ours: { story: 'components-button--options', selector: 'button >> nth=0' },
            ref: { story: `${FS}buttons-button--styles`, selector: '.fd-button--emphasized' }
        },
        {
            label: 'toggled',
            ours: { story: 'components-button--toggled', selector: 'button >> nth=0' },
            ref: { story: `${FS}buttons-button--toggle`, selector: '.fd-button--toggled >> nth=0' }
        },
        {
            label: 'disabled',
            ours: { story: 'components-button--state', selector: 'button:has(> span:text-is("Disabled State"))' },
            ref: { story: `${FS}buttons-button--button-states`, selector: 'button:text-is("Disabled State") >> nth=1' }
        },
        {
            label: 'icon only',
            ours: { story: 'components-button--icons', selector: '[aria-label="Cart standard"]' },
            ref: { story: `${FS}buttons-button--icon-and-text`, selector: 'button[title="Add to cart"] >> nth=1' }
        },
        {
            label: 'icon only emphasized',
            ours: { story: 'components-button--icons', selector: '[aria-label="Cart emphasized"]' },
            ref: { story: `${FS}buttons-button--icon-and-text`, selector: 'button[title="Add to cart"] >> nth=0' }
        },
        {
            label: 'menu icon only',
            ours: { story: 'components-button--menu', selector: '[aria-label="Menu standard"]' },
            ref: {
                story: `${FS}buttons-button--menu-button`,
                selector: '.fd-button--menu:not(:has(.fd-button__text)) >> nth=1'
            }
        },
        {
            label: 'badge',
            pixels: false,
            // different numbers in the two stories
            ignore: ['width'],
            ours: { story: 'components-button--badge', selector: '[aria-label="999 notifications"] span.absolute' },
            ref: { story: `${FS}buttons-button--badge-on-button`, selector: '.fd-button__badge >> nth=0' }
        },
        {
            label: 'badge attention',
            pixels: false,
            ours: { story: 'components-button--badge', selector: '[aria-label="Messages"] span.absolute' },
            ref: { story: `${FS}buttons-button--badge-on-button`, selector: '.fd-button__badge--attention >> nth=0' }
        }
    ],
    // titles are blocks as wide as their container and the texts differ: typography and box height only
    title: [
        ...[1, 2, 3, 4, 5, 6].map((level) => ({
            label: `h${level}`,
            pixels: false,
            ignore: ['width'],
            ours: { story: 'components-title--semantic', selector: `h${level}` },
            ref: { story: `${FS}title--levels`, selector: `h${level}` }
        })),
        {
            label: 'h1 styled as h6',
            pixels: false,
            ignore: ['width'],
            ours: { story: 'components-title--visual', selector: 'h1' },
            ref: { story: `${FS}title--visual-level`, selector: 'h1' }
        },
        {
            label: 'h6 styled as h1',
            pixels: false,
            ignore: ['width'],
            ours: { story: 'components-title--visual', selector: 'h6' },
            ref: { story: `${FS}title--visual-level`, selector: 'h6' }
        }
    ]
};
