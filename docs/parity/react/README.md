# Parity with fundamental-react: stories and tests

This folder compares every component in `registry/react/ui/` with
[SAP/fundamental-react](https://github.com/SAP/fundamental-react), and with its counterpart in the Angular registry:

1. **Stories vs. upstream stories**: each story of `src/<Component>/__stories__/*.stories.js` against our
   `<name>.stories.tsx`.
2. **Tests vs. upstream tests**: each `test(...)` of `src/<Component>/*.test.js` against our `<name>.spec.tsx`.
3. **Compared with Angular**: what `registry/angular/ui/<name>/` covers that the React port does not, and the other
   way round.

[`components/`](components/) has one file per component.

## Method

- **Upstream version:** `SAP/fundamental-react` `main` at
  [`490bd2f`](https://github.com/SAP/fundamental-react/tree/490bd2fca46e0fb09e48e488c9d7c030a166c6bf) (0.14.5).
- **API:** upstream props are kept, typed in TypeScript instead of PropTypes. React 19 passes `ref` as a prop, so
  "forwards the ref" tests check the `ref` prop. `cssNamespace` and the `noStyles` stories are dropped: no
  fundamental-styles CSS ships, the visuals are Tailwind classes on the SAP tokens (the same as the Angular registry).
- **Stories** keep the upstream examples and their content; the `dev` stories (knobs) become the Storybook controls of
  the `Primary` story.
- **Tests** are rewritten for Vitest browser mode: Enzyme selectors on fundamental-styles classes become assertions on
  roles, ARIA attributes, layout and the computed theme colours. Jest snapshot tests of the stories are replaced by
  `pnpm test:a11y`, which renders every story and checks it with axe.
- **Status:** ✅ covered · 🟡 partial · ❌ missing · ➖ n/a.
- **Item names** follow the Angular registry (`ButtonSegmented` → `segmented-button`), so the two registries line up.

## Status

| Component                                          | Upstream          | Stories | Tests  | Angular gaps                           |
| -------------------------------------------------- | ----------------- | ------- | ------ | -------------------------------------- |
| [icon](components/icon.md)                         | `Icon`            | ✅ 3/3  | ✅ 5/5 | none                                   |
| [button](components/button.md)                     | `Button`          | ✅ 7/7  | ✅ 7/7 | menu arrow, type descriptions, anchors |
| [segmented-button](components/segmented-button.md) | `ButtonSegmented` | ✅ 2/2  | ✅ 2/2 | selection state, roving focus, forms   |
