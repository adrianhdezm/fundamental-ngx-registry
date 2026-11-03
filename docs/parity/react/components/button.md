## button

Upstream: [source](https://github.com/SAP/fundamental-react/tree/main/src/Button) · Angular: `registry/angular/ui/button/`
Registry: `registry/react/ui/button/` — 8 stories, 13 tests.

### Stories vs. upstream stories

| Upstream story | Registry story | Status     | Notes                                                             |
| -------------- | -------------- | ---------- | ----------------------------------------------------------------- |
| primary        | Primary        | ✅ covered |                                                                   |
| options        | Options        | ✅ covered |                                                                   |
| types          | Types          | ✅ covered | `medium` dropped: fundamental-styles has no such type any more    |
| icons          | Icons          | ✅ covered | Plus an `iconBeforeText` example                                  |
| sizes          | Sizes          | ✅ covered |                                                                   |
| badges         | Badges         | ✅ covered |                                                                   |
| states         | States         | ✅ covered | Default, selected, disabled and focusable disabled for every type |
| dev            | Primary        | ✅ covered | Knobs become controls                                             |
| noStyles       | —              | ➖ n/a     | No `cssNamespace`                                                 |

Registry-only story: Toggle (a toggle button keeping `selected` in state).

### Tests vs. upstream tests

| Upstream test                                            | Registry test                                                     | Status     | Notes                                                |
| -------------------------------------------------------- | ----------------------------------------------------------------- | ---------- | ---------------------------------------------------- |
| should allow props to be spread to the Button component  | spreads other props to the button                                 | ✅ covered |                                                      |
| should allow spreading className to inner text           | adds textClassName to the text                                    | ✅ covered |                                                      |
| should allow spreading props to icon                     | spreads iconProps to the icon                                     | ✅ covered |                                                      |
| forwards the ref                                         | forwards the ref                                                  | ✅ covered |                                                      |
| icon before the text when `iconBeforeText` is true       | renders the icon after the text, or before it with iconBeforeText | ✅ covered | Checks the layout too                                |
| icon after the text when `iconBeforeText` is not defined | renders the icon after the text, or before it with iconBeforeText | ✅ covered |                                                      |
| a11y: aria-describedby, instructions id, ids match       | allowFocusOnDisable keeps a disabled button focusable, …          | ✅ covered | Also focus, ignored clicks and the announced message |

Registry-only tests: theme colours of every option and type at rest, on hover, selected and disabled; `aria-pressed`;
disabled buttons; `typeAttr` in forms; badge placement; compact height; icon-only buttons.

### Compared with Angular

- Same visuals (the `buttonVariants` classes are the same) and the same colour, badge and compact tests.
- API differences follow the libraries: `option`/`type` instead of `variant`, `children` instead of `label`, the icon
  after the text by default (`iconBeforeText`), `badge` as a prop instead of `fd-button-badge`, `selected` as
  `aria-pressed` (Angular has `toggled` → `aria-pressed` and `selected` → `aria-selected`).
- Only in React: `allowFocusOnDisable` with `disabledMessage` / `enabledMessage` announced in a live region.
- Only in Angular, not in fundamental-react: the menu arrow (`fdMenu`), `fullWidth`, `decisive`, hidden descriptions of
  the semantic types ("Default Action", …), anchors as buttons, the attention dot badge, focus on click in Safari.
