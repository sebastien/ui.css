# Components Module (`components.js`)

## CSS-first component primitives

`components.js` styles semantic HTML and small compositional primitives. It does
not ship a JavaScript runtime: native browser behavior remains native, while
application-owned widgets keep their lifecycle and focus management in the
application.

## Components

- Alerts: add `.alert` for styling and `role="alert"` for assistive technology, with `.success`, `.warning`, `.danger`, and `.error` variants.
- Avatars: add `.avatar`; use `.avatars` for an overlapping group.
- Content: `.card`, `.panel`, `.pill`, `.badge`, `.status`.
- Pills and badges use the background color channel, so `.bg-*` color, tint, blend, and opacity modifiers apply to them.
- Disclosure: `details.accordion`, `details.section`, `details.tree`.
- Native surfaces: `dialog` and `[popover]` receive surface and backdrop styling.
- Feedback: native `meter` (and `progress`), `.skeleton.line`, `.skeleton.box`, and `[aria-busy="true"].loading`; add semantic color classes to value bars.
- Composition: `.buttons`, `.pagination`, `.toast`, and `.toasts`.
- Pagination: apply `.pagination` to a `nav` or list. Links and buttons are styled as joined items; use `aria-current="page"` for the current page.
- Tabs: use `.tabs .tab` for the classic bordered tab strip, or `.tabs.group .tab` for the filled, rounded presentation; they wrap when they exceed the parent width. Add `.compact` to the tab bar or an individual tab for reduced padding, `.tabs.compacted` for a full-width bar whose tabs stay min-content, `.tabs.vertical` to stack tabs, or `.tabs.bar` for a border-side presentation with neutral inactive and ink active tabs. On `.tabs.bar.vertical`, the rule and active indicator are on the right by default; add `.left` or `.right` to choose the side. Add `.top` or `.bottom` for horizontal placement. A semantic color on the tab bar makes inactive tabs ink and active tabs use that semantic color. Tabs use the background color channel, so `.bg-*` modifiers apply. Retain `role="tablist"` and `role="tab"` for semantics.
- Popover menu items: add `.compact` to an action item or its `menu` to reduce menu-row padding.
- Tooltip: add authored text with `data-tooltip`; unlike Oat, ui.css does not transform `title` attributes with JavaScript.

## Native behavior

Use the platform API or application code to control dynamic state:

- `<details>` supplies disclosure keyboard behavior.
- `<dialog>` can use declarative commands where supported or `showModal()` / `close()`.
- `[popover]` can use `popovertarget` and `popovertargetaction`.
- Toast placement, dismissal, and queueing are intentionally application-owned.

See `examples/components.html` for complete, accessible markup examples.
