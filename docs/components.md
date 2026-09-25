# Components Module (`components.js`)

## CSS-first component primitives

`components.js` styles semantic HTML and small compositional primitives. It does
not ship a JavaScript runtime: native browser behavior remains native, while
application-owned widgets keep their lifecycle and focus management in the
application.

## Components

- Alerts: add `.alert` for styling and `role="alert"` for assistive technology, with `.success`, `.warning`, `.danger`, and `.error` variants.
- Avatars: add `.avatar`; use `.avatars` for an overlapping group.
- Attachments: add `.attachment` around `.media`, `.content` (`.title` / `.description`), and `.actions` (`.action`). Use `data-state="idle|uploading|processing|error|done"`, `.vertical`, and `.small` / `.smaller`.
- Content: `.card`, `.panel`, `.pill`, `.badge`, `.count`, `.status`.
- Divider: use `.divider` between resizable side-by-side panels. Add `.horizontal` or `aria-orientation="horizontal"` between stacked panels. Add a `.handle` child for the centered, 5px-wide rounded grip; application code supplies the resize behavior and separator keyboard interaction.
- Pills and badges use the background color channel, so `.bg-*` color, tint, blend, and opacity modifiers apply to them. `.badge` is a pill-shaped text chip; add `.count` (or use `.count` alone) for a circular number counter whose size is `--badge-size`.
- Disclosure: `details.accordion`, `details.section`, `details.tree`. Bodies animate through `details::details-content`: height and content-visibility transition smoothly where `interpolate-size` is supported (instant open/close elsewhere), and div-based `.accordion` panels use a `grid-template-rows` transition. All disclosure motion collapses under `prefers-reduced-motion`.
- Native surfaces: `dialog` and `[popover]` receive surface and backdrop styling.
- Feedback: native `meter` (and `progress`), `.skeleton.line`, `.skeleton.box`, and `[aria-busy="true"].loading`; add semantic color classes to value bars.
- Composition: `.buttons`, `.pagination`, `.toast`, and `.toasts`.
- Pagination: apply `.pagination` to a `nav` or list. Links and buttons are styled as joined items; use `aria-current="page"` for the current page.
- Tabs: use `.tabs .tab` for the classic bordered tab strip, `.tabs.group .tab` for the filled, rounded presentation, `.tabs.outline` for border-side navigation with neutral inactive and ink active tabs, or `.tabs.bar` for a joined, bordered horizontal bar whose active tab is filled with the accent (like a checked `.selector`). Add `.wrap` to let them wrap when they exceed the parent width. Add `.compact` to the tab bar or an individual tab for reduced padding, `.tabs.compacted` for a full-width bar whose tabs stay min-content, or `.tabs.vertical` to stack tabs (with `.outline`, the rule and active indicator are on the right by default; add `.left` or `.right` to choose the side, and `.top` or `.bottom` for placement). A semantic color on the tab bar or an individual tab drives `.tabs.bar`'s active fill and `.tabs.outline`'s active text color. Tabs use the background color channel, so `.bg-*` modifiers apply. Retain `role="tablist"` and `role="tab"` for semantics.
- Popover menu items: add `.compact` to an action item or its `menu` to reduce menu-row padding.
- Tooltip: add authored text with `data-tooltip`; unlike Oat, ui.css does not transform `title` attributes with JavaScript.

## Native behavior

Use the platform API or application code to control dynamic state:

- `<details>` supplies disclosure keyboard behavior.
- `<dialog>` can use declarative commands where supported or `showModal()` / `close()`.
- `[popover]` can use `popovertarget` and `popovertargetaction`.
- Toast placement, dismissal, and queueing are intentionally application-owned.

See `examples/components.html` for complete, accessible markup examples.
