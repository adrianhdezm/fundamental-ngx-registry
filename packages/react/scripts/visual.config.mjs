/**
 * Visual cases for scripts/visual.mjs: an element of one of our stories (`ours`) and the matching element of a
 * fundamental-styles story (`ref`), compared in all 16 combinations of theme, density and direction.
 *
 *   label     name in the report
 *   ours      { story: Storybook story id, selector: Playwright selector of the element }
 *   ref       the same for https://sap.github.io/fundamental-styles/
 *   hover     hover the element before capturing
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
    ]
};
