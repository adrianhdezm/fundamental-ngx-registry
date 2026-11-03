## segmented-button

Upstream: [source](https://github.com/SAP/fundamental-react/tree/main/src/Button/ButtonSegmented.js) · Angular:
`registry/angular/ui/segmented-button/`
Registry: `registry/react/ui/segmented-button/` — 3 stories, 6 tests.

### Stories vs. upstream stories

| Upstream story | Registry story | Status     | Notes                               |
| -------------- | -------------- | ---------- | ----------------------------------- |
| primary        | Primary        | ✅ covered | Icon-only segments; a click selects |
| compact        | Compact        | ✅ covered |                                     |
| noStyles       | —              | ➖ n/a     | No `cssNamespace`                   |

Registry-only story: Text (text segments in the default size).

### Tests vs. upstream tests

| Upstream test                                                    | Registry test                    | Status     | Notes |
| ---------------------------------------------------------------- | -------------------------------- | ---------- | ----- |
| should allow props to be spread to the ButtonSegmented component | spreads other props to the group | ✅ covered |       |
| forwards the ref                                                 | forwards the ref                 | ✅ covered |       |

Registry-only tests: labelled group with pressed state; joined layout and colours; high-contrast borders and corners;
outer corners with a focusable disabled button.

### Compared with Angular

- Same visuals (pad, transparent segments, high-contrast joined borders); the selectors use `:first-of-type` /
  `:last-of-type` so the hidden instructions of a focusable disabled button do not break the corners.
- Upstream sets `aria-label="Group label"` on every group and ignores the prop; the port takes `aria-label` from the
  props.
- Only in Angular: a listbox with single and multiple selection state, roving focus with arrow keys (mirrored in RTL),
  vertical orientation and forms support. fundamental-react leaves the selection to the app (`selected` on each
  button). A later change can add these with the Base UI toggle group.
