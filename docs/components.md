# Components Module (`components.js`)

## CSS-first component primitives

`components.js` styles semantic HTML and small compositional primitives. It does
not ship a JavaScript runtime: native browser behavior remains native, while
application-owned widgets keep their lifecycle and focus management in the
application.

## Components

- Alerts: `[role="alert"]` or `.alert`, with `.success`, `.warning`, `.danger`, and `.error` variants.
- Avatars: `figure.avatar` or `figure[data-avatar]`; use `.avatars` for an overlapping group.
- Content: `.card`, `.panel`, `.pill`, `.badge`, `.status`.
- Pills and badges use the background color channel, so `.bg-*` color, tint, blend, and opacity modifiers apply to them.
- Disclosure: `details.accordion`, `details.section`, `details.tree`.
- Native surfaces: `dialog` and `[popover]` receive surface and backdrop styling.
- Feedback: native `progress` and `meter`, `.skeleton.line`, `.skeleton.box`, and `[aria-busy="true"].loading`.
- Composition: `.buttons`, `.table`, `.toast`, `.toasts`, `.sidebar-layout`, and `.sidebar`.
- Tooltip: add authored text with `data-tooltip`; unlike Oat, ui.css does not transform `title` attributes with JavaScript.

## Native behavior

Use the platform API or application code to control dynamic state:

- `<details>` supplies disclosure keyboard behavior.
- `<dialog>` can use declarative commands where supported or `showModal()` / `close()`.
- `[popover]` can use `popovertarget` and `popovertargetaction`.
- Toast placement, dismissal, and queueing are intentionally application-owned.

See `examples/components.html` for complete, accessible markup examples.
