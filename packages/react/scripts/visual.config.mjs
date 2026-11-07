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

export const CASES = {};
