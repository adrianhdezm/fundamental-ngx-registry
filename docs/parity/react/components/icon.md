## icon

Upstream: [source](https://github.com/SAP/fundamental-react/tree/main/src/Icon) · Angular: `registry/angular/ui/icon/`
Registry: `registry/react/ui/icon/` — 7 stories, 9 tests.

### Stories vs. upstream stories

| Upstream story | Registry story | Status     | Notes                                                           |
| -------------- | -------------- | ---------- | --------------------------------------------------------------- |
| primary        | Primary        | ✅ covered | Controls for every prop                                         |
| sizes          | Sizes          | ✅ covered | s, default, m, l, xl                                            |
| iconList       | All SAP-icons  | ✅ covered | With a search field; TNT and Business Suite galleries added too |
| noStyles       | —              | ➖ n/a     | No `cssNamespace`                                               |

Registry-only stories: Colors, Mirroring in RTL, All SAP-icons-TNT, All Business Suite icons (from the Angular registry).

### Tests vs. upstream tests

| Upstream test               | Registry test                                              | Status     | Notes                                      |
| --------------------------- | ---------------------------------------------------------- | ---------- | ------------------------------------------ |
| click on icon               | calls onClick when clicked                                 | ✅ covered |                                            |
| passes aria-label prop      | passes ariaLabel as aria-label and makes the icon an image | ✅ covered |                                            |
| passes the aria-hidden prop | passes ariaHidden as aria-hidden; …decorative              | ✅ covered |                                            |
| Prop spreading              | spreads other props to the element                         | ✅ covered |                                            |
| forwards the ref            | forwards the ref                                           | ✅ covered | Checks the glyph instead of the class name |

Registry-only tests: glyph resolution in the three fonts, RTL mirroring, sizes, colours and backgrounds.

### Compared with Angular

- Same glyph map, fonts, colours, backgrounds and RTL mirroring; the same tests.
- Sizes follow fundamental-react (`s` 0.75rem, `m` 1rem, `l` 1.25rem, `xl` 1.5rem), not fundamental-ngx (`sm` … `xxl`,
  1rem to 5rem).
- Upstream always renders `role="img"`; like the Angular icon, an icon without `ariaLabel` is decorative
  (`aria-hidden`, `role="presentation"`), so an unlabelled icon never fails axe.
