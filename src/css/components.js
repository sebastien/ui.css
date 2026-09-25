import css, { keyframes, vars } from "../js/uicss.js";
import { colormix } from "./colors.js";
import colors from "./colors.js";

// Structural border recipe, resolved at the painted element so local
// --border-color-* overrides (.bd-3o, semantic variants) take effect.
const bd = colormix(
	vars.border.color.base,
	vars.border.color.tint,
	vars.border.color.blend,
	vars.border.color.opacity,
);

function pill(...rest) {
	return css.nesting(
		[".pill", ".badge", ".count"],
		{},
		css.rule("&", {
			// Box
			display: "inline-flex",
			padding: vars.pill.padding,
			font_size: vars.pill.font_size,
			font_weight: "500",
			align_items: "center",
			white_space: "nowrap",
			gap: vars.pill.gap.or(vars.gap),
			line_height: vars.pill.line_height,
			// Border — transparent by default (borderless like the reference);
			// the outline variant re-enables it.
			border_width: "0px",
			border_style: "solid",
			border_color: "transparent",
			border_radius: "9999px",
			// Accent identifies the semantic variant; paint remains in shared channels.
			__accent: vars.color.neutral,
			__background_color_base: vars.accent,
			__background_color_tint: vars.color.surface,
			__background_color_blend: 1.0,
			__background_color_opacity: 1.0,
			background_color: vars.pill.bg.or(vars.background.color),
			color: vars.pill.text.or(vars.color.paper),
		}),
		css.rule("&.dot > *:first-child:before", {
			display: "inline-block",
			content: '""',
			width: vars.pill.dot_size,
			height: vars.pill.dot_size,
			margin_right: vars.pill.gap.or(vars.gap),
			border_radius: "50%",
			background_color: vars.pill.dot_color.or("currentColor"),
		}),
		// Icon slot: inline svg sized to the pill font (like the label).
		css.rule("& svg", {
			width: vars.pill.icon_size,
			height: vars.pill.icon_size,
		}),
		css.rule("&.compact", {
			padding: vars.pill.padding.compact,
		}),
		css.rule("&.expanded", {
			padding: vars.pill.padding.expanded,
		}),
		// Count: opt-in circular counter chip (number badge); bare .badge
		// stays a pill-shaped text chip. `.count` is also a standalone host,
		// so badge count, pill count, and count all resolve to a circle.
		css.rule("&:where(.count)", {
			width: vars.badge.size.or("1.25rem"),
			aspect_ratio: "1",
			justify_content: "center",
			padding: "0em",
			line_height: "1",
			font_size: "0.75rem",
		}),
		// Color variants: solid color bg with light text
		...colors.semantic.map((color) =>
			css.rule(css.mods("&", color), {
				__accent: vars.color[color],
			}),
		),
		// Soft: light neutral background with dark text.
		css.rule("&.soft", {
			__background_color_base: vars.color.neutral,
			__background_color_tint: vars.color.paper,
			__background_color_blend: 0.1,
			__background_color_opacity: 1.0,
			color: vars.color.ink,
			border_color: "transparent",
		}),
		// Tinted: color @ 10% bg with full color text
		css.rule("&.tinted", {
			__background_color_base: vars.accent,
			__background_color_tint: "transparent",
			__background_color_blend: 0.1,
			__background_color_opacity: 1.0,
			color: vars.pill.text.or(vars.accent),
			border_color: "transparent",
		}),
		// Outline: transparent bg with color border and darkened text
		css.rule("&.outline", {
			__background_color_base: vars.accent,
			__background_color_tint: vars.color.paper,
			__background_color_blend: 1.0,
			__background_color_opacity: 0,
			border_width: "1px",
			border_color: `color-mix(in oklch, ${vars.accent}, ${vars.color.surface} 60%)`,
			color: `color-mix(in oklch, ${vars.accent}, ${vars.color.surface_text} 40%)`,
		}),
		...rest,
	);
}

function tooltip(...rest) {
	return css.group(
		css.rule("[data-tooltip]", { position: "relative" }),
		css.rule("[data-tooltip]::after", {
			content: "attr(data-tooltip)",
			position: "absolute",
			z_index: "10",
			bottom: "calc(100% + 0.5rem)",
			left: "50%",
			width: "max-content",
			max_width: "min(20rem, 80vw)",
			padding: "0.35rem 0.5rem",
			border_radius: vars.border.radius[1],
			background_color: vars.color.surface_text,
			color: vars.color.surface,
			font_size: "0.8em",
			line_height: "1.25",
			opacity: "0",
			pointer_events: "none",
			transform: "translate(-50%, 0.2rem)",
			transition: "opacity 120ms ease, transform 120ms ease",
		}),
		css.rule("[data-tooltip]:is(:hover, :focus-visible)::after", {
			opacity: "1",
			transform: "translate(-50%, 0)",
		}),
		...rest,
	);
}

function buttongroup(...rest) {
	return css.group(
		css.rule(".buttons", {
			display: "inline-flex",
			gap: "1px",
			padding: "0",
			margin: "0",
			list_style: "none",
		}),
		css.rule(".buttons > *", { display: "flex" }),
		css.rule(".buttons > * > :not(:first-child)", { margin_left: "0" }),
		css.rule(".buttons > *:not(:first-child) > *", {
			margin_left: "0",
			border_top_left_radius: "0",
			border_bottom_left_radius: "0",
		}),
		css.rule(".buttons > *:not(:last-child) > *", {
			border_top_right_radius: "0",
			border_bottom_right_radius: "0",
		}),
		css.rule(".buttons.outline", { gap: "0" }),
		css.rule(".buttons.outline > * > *", {
			border_left_width: "0",
		}),
		css.rule(".buttons.outline > *:first-child > *", {
			border_left_width: vars.control.border.width.or("1px"),
		}),
		...rest,
	);
}

function divider() {
	return css.group(
		css.rule(".divider", {
			position: "relative",
			display: "flex",
			flex: "0 0 auto",
			align_self: "stretch",
			align_items: "center",
			justify_content: "center",
			width: vars.divider.width.or("1px"),
			background_color: bd,
			cursor: "col-resize",
			touch_action: "none",
		}),
		// A wider pseudo-element makes the 1px separator practical to drag.
		css.rule(".divider::after", {
			content: '\"\"',
			position: "absolute",
			top: "0",
			bottom: "0",
			left: "50%",
			width: vars.divider.hit.width.or("0.5rem"),
			transform: "translateX(-50%)",
		}),
		css.rule(".divider > .handle", {
			position: "relative",
			z_index: "1",
			width: vars.divider.handle.width.or("5px"),
			height: vars.divider.handle.height.or("1.5rem"),
			border_radius: vars.divider.handle.radius.or("999px"),
			background_color: bd,
		}),
		css.rule(".divider:focus-visible", {
			outline: `2px solid ${vars.outline.color}`,
			outline_offset: "2px",
		}),
		css.rule([".divider.horizontal", ".divider[aria-orientation=horizontal]"], {
			align_self: "auto",
			width: "auto",
			height: vars.divider.width.or("1px"),
			cursor: "row-resize",
		}),
		css.rule(
			[".divider.horizontal::after", ".divider[aria-orientation=horizontal]::after"],
			{
				top: "50%",
				bottom: "auto",
				left: "0",
				width: "auto",
				height: vars.divider.hit.width.or("0.5rem"),
				transform: "translateY(-50%)",
			},
		),
		css.rule(
			[
				".divider.horizontal > .handle",
				".divider[aria-orientation=horizontal] > .handle",
			],
			{
				width: vars.divider.handle.height.or("1.5rem"),
				height: vars.divider.handle.width.or("5px"),
			},
		),
	);
}

function toast(...rest) {
	return css.group(
		css.rule(".toast", {
			display: "grid",
			gap: "0.35rem",
			min_width: "18rem",
			padding: "0.9rem 1rem",
			border: `1px solid ${bd}`,
			border_radius: vars.border.radius[2],
			background_color: vars.color.surface,
			box_shadow: "0 12px 28px rgb(41 37 34 / 0.14)",
		}),
		css.rule(".toasts", {
			position: "fixed",
			z_index: "10",
			top: "1rem",
			right: "1rem",
			display: "grid",
			gap: "0.75rem",
		}),
		...rest,
	);
}

function status(...rest) {
	return css.nesting(
		[".status"],
		{},
		css.rule("&", {
			// Box
			display: "inline-flex",
			padding: vars.status.padding.or("2px"),
			font_size: "inherit",
			gap: "0.25em",
			// Border
			border_width: vars.status.border.size.or("0px"),
			border_radius: vars.status.border.radius.or("1em"),
			__accent: vars.status.color.base.or(vars.color.neutral),
			border_color: colors.mixed(
				vars.accent,
				vars.status.color.tint.or(vars.color.paper),
				0.5,
				1.0,
			),
			background_color: colors.mixed(
				vars.color.neutral,
				vars.color.paper,
				0.5,
				0.3,
			),
			color: `contrast-color(${vars.accent})`,
		}),
		// Color variants
		...colors.semantic.map((color) =>
			css.rule(css.mods(["&", "& > *"], color), {
				__accent: vars.color[color],
			}),
		),
		css.rule("& > *", {
			display: "inline-block",
			border_radius: vars.status.border.radius.or("1em"),
			width: "2em",
			height: "0.25em",
			background_color: colors.mixed(
				vars.accent,
				vars.status.color.tint.or(vars.color.paper),
				1.0,
				1.0,
			),
		}),
		css.rule("&.outline > *", {
			background_color: "transparent",
			border_width: vars.status.border.size.or("1px"),
			border_color: colors.mixed(
				vars.accent,
				vars.status.color.tint.or(vars.color.paper),
				1.0,
				1.0,
			),
		}),
		...rest,
	);
}

function popover(...rest) {
	return css.nesting(
		[".popover"],
		{},
		css.rule("&", {
			position: "fixed",
			position_anchor: vars.popover.anchor.or("top"),
			position_area: vars.popover.area.or("block-end span-inline-end"),
			position_try_fallbacks: vars.popover.fallbacks.or(
				"flip-block, flip-inline",
			),
		}),
		// Only show when used as a native popover that is open (or non-popover .popover)
		css.rule("&:popover-open, &:not([popover])", {
			display: "block",
		}),
		...rest,
	);
}
function card(...rest) {
	return css.nesting(
		[".card", ".panel"],
		{},
		css.rule("&", {
			padding: vars.card.padding.or("0.5em"),
			__accent: vars.card.color.base.or(vars.color.neutral),
			__background_color_base: vars.accent,
			__background_color_tint: vars.card.color.tint.or(vars.color.surface),
			__background_color_blend: vars.card.color.blend.or(0.1),
			__background_color_opacity: vars.card.color.alpha.or(1.0),
			__background_color: colormix(
				vars.background.color.base,
				vars.background.color.tint,
				vars.background.color.blend,
				vars.background.color.opacity,
			),
			// Border
			border_width: vars.card.border.width.or("1px"),
			border_radius: vars.card.border.radius.or("0.5em"),
			border_color: bd,
			// Background
			background_color: vars.background.color,
		}),
		// Color variants: identity tints the surface and edge from the accent.
		...colors.semantic.map((color) =>
			css.rule(css.mods("&", color), {
				__accent: vars.color[color],
				__border_color_base: vars.color[color],
				__border_color_tint: vars.card.color.tint.or(vars.color.surface),
				__border_color_blend: 0.35,
				__border_color_opacity: 1.0,
			}),
		),
		...rest,
	);
}

function breadcrumbs() {
	return css.group(
		css.rule(".breadcrumbs", {
			display: "inline-flex",
			flex_wrap: "wrap",
		}),
		css.rule(".breadcrumbs > li", {
			display: "fleX",
			align_items: "center",
		}),
		css.rule(".breadcrumbs > li + ::before", {
			content: '""',
			opacity: 0.4,
			border_top: "1px solid",
			border_right: "1px solid",
			width: ".375rem",
			height: ".375rem",
			margin_left: ".5rem",
			margin_right: ".75rem",
			display: "block",
			rotate: "45deg",
		}),
	);
}

function section() {
	const border = bd;
	const background = (blend) =>
		colormix(
			vars.background.color.base,
			vars.background.color.tint,
			blend,
			vars.background.color.opacity,
		);
	const radius = vars.section.border.radius.or(vars.border.radius[1]);
	return css.group(
		css.rule("details.section", {
			border: `1px solid ${border}`,
			border_radius: `${radius}`,
			margin_bottom: vars.section.margin.or(vars.margin[2]),
		}),

		css.rule("details.section summary", {
			display: "flex",
			align_items: "center",
			gap: vars.gap[1],
			cursor: "pointer",
			user_select: "none",
			padding: vars.section.summary.padding.or(`${vars.pad[2]}`),
			background_color: background(0.7),
			border_radius: `${radius} ${radius} 0 0`,
			font_weight: "inherit",
			transition: "background-color 0.2s ease",
		}),

		// Hover raises elevation instead of tinting the header
		// (AL shadow-sm -> shadow-md).
		css.rule("details.section:where(:hover)", {
			box_shadow: `calc(${vars.shadow.x} * 2) calc(${vars.shadow.y} * 2) calc(${vars.shadow.spread} * 2) ${vars.shadow.color}`,
		}),

		// Marker: border-drawn chevron pointing down, rotating to up when
		// open (AL rotates its svg chevron 180deg over 300ms). Glyph box
		// 0.75em with ~0.12em stroke ≈ the AL 12px/2px chevron inside a
		// 24px icon slot.
		css.rule("details.section summary:after", {
			content: '""',
			display: "inline-block",
			margin_left: "auto",
			width: "0.75em",
			height: "0.75em",
			border_right: "max(2px, 0.12em) solid currentColor",
			border_bottom: "max(2px, 0.12em) solid currentColor",
			transform: "rotate(45deg)",
			transform_origin: "center",
			transition: `transform ${vars.motion.duration.base} ${vars.motion.easing.out}`,
		}),

		css.rule("details.section[open] summary:after", {
			transform: "rotate(225deg)",
		}),

		css.rule("details.section > *:not(summary)", {
			padding: vars.section.body.padding.or(`${vars.pad[2]}`),
			// Body reads as the same surface as the header (AL: white panel
			// on a white item). Both compose through the shared background
			// channels, so setting --background-color-* on the details (or
			// an ancestor, custom props inherit through shadow boundaries)
			// retints header and body together; a .bg-* class on a wrapper
			// element around the composite works the same way.
			background_color: background(0.7),
		}),
	);
}

function panels() {
	return css.group(
		css.rule(".panels", {
			width: "100%",
			position: "relative",
			overflow: "clip",
			__panels_current: "0",
			__panels_count: "2",
		}),

		css.rule(".panels > .horizontal", {
			position: "relative",
			display: "grid",
			grid_template_columns: `repeat(${vars.panels.count}, 1fr)`,
			align_items: "stretch",
			left: `calc(-100% * ${vars.panels.current})`,
			width: `calc(100% * ${vars.panels.count})`,
			min_width: "100%",
			height: "100%",
			transition: `left ${vars.motion.duration.base} ${vars.motion.easing.soft}`,
		}),

		css.rule(".panels > .horizontal > *", {
			height: "100%",
			max_height: "100%",
			min_height: "100%",
			overflow: "auto",
			border: "0px solid transparent",
			box_sizing: "border-box",
		}),

		css.rule(".panels > .vertical", {
			position: "relative",
			display: "grid",
			grid_template_rows: `repeat(${vars.panels.count}, 1fr)`,
			top: `calc(-100% * ${vars.panels.current})`,
			height: `calc(100% * ${vars.panels.count})`,
			min_height: "100%",
			width: "100%",
			transition: `top ${vars.motion.duration.base} ${vars.motion.easing.soft}`,
		}),

		css.rule(".panels > .vertical > *", {
			height: "100%",
			max_height: "100%",
			min_height: "100%",
			overflow: "auto",
			border: "0px solid transparent",
			box_sizing: "border-box",
		}),

		css.rule('.panels[data-panels="2"]', {
			__panels_count: "2",
		}),

		css.rule('.panels[data-panels="3"]', {
			__panels_count: "3",
		}),

		css.rule('.panels[data-panels="4"]', {
			__panels_count: "4",
		}),

		css.rule('.panels[data-panels="5"]', {
			__panels_count: "5",
		}),

		css.rule('.panels[data-panels="6"]', {
			__panels_count: "6",
		}),

		css.rule('.panels[data-panel="0"]', {
			__panels_current: "0",
		}),

		css.rule('.panels[data-panel="1"]', {
			__panels_current: "1",
		}),

		css.rule('.panels[data-panel="2"]', {
			__panels_current: "2",
		}),

		css.rule('.panels[data-panel="3"]', {
			__panels_current: "3",
		}),

		css.rule('.panels[data-panel="4"]', {
			__panels_current: "4",
		}),

		css.rule('.panels[data-panel="5"]', {
			__panels_current: "5",
		}),
	);
}

function tree() {
	const border = bd;
	return css.group(
		css.rule("details.tree", {
			__tree_indent: "1em",
			border_top: `1px solid ${border}`,
			border_collapse: "collapse",
		}),
		css.rule("details.tree[open]", {}),
		css.rule("details.tree summary", {
			cursor: "pointer",
			user_select: "none",
			padding: `${vars.pad[1]}`,
			padding_left: `calc(${vars.tree.depth} * ${vars.tree.indent})`,
		}),

		css.rule("details.tree>summary:before", {
			display: "inline-flex",
			align_items: "center",
			justify_content: "center",
			aspect_ratio: 1,
			width: "1em",
			content: "'·'",
		}),

		css.rule("details.tree[data-icon]>summary:before", {
			content: "attr(data-icon)",
		}),

		css.rule("details.tree:has(details)>summary:before", {
			content: "'▸'",
		}),

		css.rule("details.tree[open]:has(details)>summary:before", {
			transform: "rotate(90deg)",
		}),

		css.rule("details.tree details", {
			__tree_depth: 1,
		}),
		css.rule("details.tree details details", {
			__tree_depth: 2,
		}),

		css.rule("details.tree details details details", {
			__tree_depth: 3,
		}),

		css.rule("details.tree details details details details", {
			__tree_depth: 4,
		}),

		css.rule("details.tree details details details details details", {
			__tree_depth: 5,
		}),
	);
}

function alert() {
	return css.group(
		css.rule(".alert", {
			display: "block",
			font_size: "0.875em",
			padding: vars.alert.padding,
			border_width: "1px",
			border_style: "solid",
			border_radius: vars.alert.border.radius,
			border_color: bd,
			background_color: vars.color.surface,
			color: vars.color.surface_text,
		}),
		...[
			["success", vars.color.success],
			["warning", vars.color.warning],
			["danger", vars.color.danger],
			["error", vars.color.error],
			["info", vars.color.info],
		].map(([name, color]) =>
			css.rule(`.alert.${name}`, {
				border_width: "0",
				background_color: `color-mix(in oklch, ${color}, transparent 88%)`,
				color: `${color}`,
			}),
		),
		...[
			["success", vars.color.success],
			["warning", vars.color.warning],
			["danger", vars.color.danger],
			["error", vars.color.error],
			["info", vars.color.info],
		].map(([name, color]) =>
			css.rule([`.alert.ghost.${name}`, `.alert.outline.${name}`], {
				__accent: color,
				border_width: "1px",
				background_color: "transparent",
				border_color: `${color}`,
				color: `${color}`,
			}),
		),
		css.rule([".alert.ghost", ".alert.outline"], {
			__accent: vars.color.neutral,
			border_width: "1px",
			background_color: "transparent",
			border_color: bd,
			color: vars.color.surface_text,
		}),
		css.rule(
			":where(.alert.outline) :where(input, textarea, select, .input, .textarea, .select):not(.colored)",
			{
			color: "inherit",
			},
		),
	);
}

function avatar() {
	return css.group(
		css.rule([".avatar", "figure[data-avatar]"], {
			display: "inline-grid",
			place_items: "center",
			aspect_ratio: 1,
			width: vars.avatar.size,
			height: vars.avatar.size,
			margin: "0",
			overflow: "clip",
			border_radius: "50%",
			background_color: `color-mix(in oklch, ${vars.color.neutral}, ${vars.color.surface} 82%)`,
			color: `color-mix(in oklch, ${vars.color.neutral}, ${vars.color.surface_text} 52%)`,
			font_weight: "600",
		}),
		css.rule([".avatar img", "figure[data-avatar] img"], {
			width: "100%",
			height: "100%",
			object_fit: "cover",
		}),
		css.rule([".avatar.small", "figure[data-avatar].small"], {
			width: vars.avatar.small,
			height: vars.avatar.small,
		}),
		css.rule([".avatar.large", "figure[data-avatar].large"], {
			width: vars.avatar.large,
			height: vars.avatar.large,
		}),
		css.rule(".avatars", { display: "flex", padding_left: "0.35rem" }),
		css.rule(".avatars > :is(.avatar, figure[data-avatar])", {
			margin_left: "-0.35rem",
			border: `2px solid ${vars.color.surface}`,
		}),
	);
}

function attachment() {
	const muted = `color-mix(in oklch, ${vars.color.neutral}, ${vars.color.surface} 82%)`;
	const description = `color-mix(in oklch, ${vars.color.surface_text}, ${vars.color.surface} 40%)`;
	return css.group(
		css.rule(".attachment", {
			position: "relative",
			display: "flex",
			flex_wrap: "wrap",
			align_items: "center",
			gap: "0.5rem",
			width: "fit-content",
			max_width: "100%",
			min_width: "0",
			padding: "0.5rem",
			border: `1px solid ${bd}`,
			border_radius: vars.border.radius[2],
			background_color: vars.color.surface,
			color: vars.color.surface_text,
			font_size: "0.875rem",
		}),
		css.rule(".attachment:has(> a, > button)", { cursor: "pointer" }),
		css.rule(".attachment:has(> a, > button):hover", {
			background_color: muted,
		}),
		css.rule(".attachment:focus-within", {
			outline: `2px solid ${vars.outline.color}`,
			outline_offset: "2px",
		}),
		// Media
		css.rule(".attachment .media", {
			display: "flex",
			flex: "none",
			align_items: "center",
			justify_content: "center",
			width: "2.5rem",
			aspect_ratio: "1",
			overflow: "clip",
			border: `1px solid ${bd}`,
			border_radius: vars.border.radius[1],
			background_color: muted,
		}),
		css.rule(".attachment .media > img", {
			width: "100%",
			height: "100%",
			object_fit: "cover",
		}),
		// Content
		css.rule(".attachment .content", {
			flex: "1 1 auto",
			min_width: "0",
			line_height: "1.25",
		}),
		css.rule(".attachment .title", {
			display: "block",
			overflow: "hidden",
			text_overflow: "ellipsis",
			white_space: "nowrap",
			font_weight: "600",
		}),
		css.rule(".attachment .description", {
			display: "block",
			overflow: "hidden",
			text_overflow: "ellipsis",
			white_space: "nowrap",
			font_size: "0.75em",
			color: description,
		}),
		// Actions
		css.rule(".attachment .actions", {
			display: "flex",
			flex: "none",
			align_items: "center",
			gap: "0.25rem",
		}),
		css.rule(".attachment .action", {
			display: "inline-flex",
			align_items: "center",
			justify_content: "center",
			width: "1.5rem",
			height: "1.5rem",
			padding: "0",
			border: "0",
			border_radius: vars.border.radius[1],
			background: "transparent",
			color: "inherit",
			cursor: "pointer",
		}),
		css.rule(".attachment .action:hover", { background_color: muted }),
		// Optional whole-attachment trigger.
		css.rule(".attachment .trigger", {
			position: "absolute",
			inset: "0",
			z_index: "1",
			border: "0",
			background: "transparent",
			cursor: "pointer",
		}),
		// States
		css.rule(".attachment[data-state=idle]", { border_style: "dashed" }),
		css.rule(".attachment[data-state=error]", {
			background_color: vars.color.surface_text,
			color: vars.color.surface,
		}),
		css.rule(".attachment[data-state=error] .media", {
			background_color: vars.color.surface,
			color: vars.color.surface_text,
		}),
		css.rule(".attachment[data-state=error] .description", {
			color: "inherit",
		}),
		css.rule(
			[
				".attachment[data-state=uploading] .title",
				".attachment[data-state=processing] .title",
			],
			{ animation: "attachment-pulse 1.4s ease-in-out infinite" },
		),
		keyframes("attachment-pulse", {
			"0%, 100%": { opacity: 1 },
			"50%": { opacity: "0.62" },
		}),
		// Sizes reuse the shared text size classes (.small, .smaller).
		css.rule(".attachment.small", { gap: "0.4rem", padding: "0.4rem" }),
		css.rule(".attachment.small .media", { width: "2rem" }),
		css.rule(".attachment.smaller", { gap: "0.3rem", padding: "0.25rem" }),
		css.rule(".attachment.smaller .media", { width: "1.75rem" }),
		// Vertical
		css.rule(".attachment.vertical", {
			flex_direction: "column",
			align_items: "stretch",
			width: "6rem",
		}),
		css.rule(".attachment.vertical .media", { width: "100%" }),
		css.rule(".attachment.vertical .content", { padding: "0 0.25rem" }),
		css.rule(".attachment.vertical .actions", {
			position: "absolute",
			top: "0.5rem",
			right: "0.5rem",
		}),
	);
}

function native() {
	return css.group(
		css.rule("details.accordion", {
			border: `1px solid ${bd}`,
			border_radius: "0",
			background_color: vars.color.surface,
			color: vars.color.surface_text,
		}),
		css.rule("details.accordion:first-of-type", {
			border_top_left_radius: vars.border.radius[2],
			border_top_right_radius: vars.border.radius[2],
		}),
		css.rule("details.accordion:last-of-type", {
			border_bottom_left_radius: vars.border.radius[2],
			border_bottom_right_radius: vars.border.radius[2],
		}),
		css.rule("details.accordion + details.accordion", {
			margin_top: "-1px",
		}),
		css.rule("details.accordion summary", {
			display: "flex",
			align_items: "center",
			justify_content: "space-between",
			gap: vars.gap,
			padding: "0.8rem 1rem",
			cursor: "pointer",
			font_weight: "600",
		}),
		css.rule("details.accordion > summary::after", {
			content: "'▾'",
			transform_origin: "center",
			transition: `transform ${vars.motion.duration.base} ${vars.motion.easing.out}`,
		}),
		css.rule("details.accordion[open] > summary::after", {
			transform: "rotate(180deg)",
		}),
		css.rule("details.accordion > :not(summary)", { padding: "0 1rem 1rem" }),
		css.rule("dialog", {
			width: `min(${vars.dialog.width}, calc(100vw - 2rem))`,
			max_height: "85vh",
			padding: "0",
			border: `1px solid ${bd}`,
			border_radius: "0.75rem",
			background_color: vars.color.surface,
			color: vars.color.surface_text,
			box_shadow: "0 20px 48px rgb(9 9 11 / 0.18)",
		}),
		css.rule("dialog > *", {
			padding: "1.5rem",
		}),
		css.rule("dialog > footer, dialog > [class*=footer]", {
			padding_top: "0",
		}),
		css.rule("dialog::backdrop", { background_color: "rgb(9 9 11 / 0.42)" }),
		css.rule("dialog > :is(header, footer)", {
			display: "flex",
			align_items: "center",
			gap: vars.gap[2],
		}),
		css.rule("dialog > footer", {
			justify_content: "flex-end",
			margin_top: "1.25rem",
		}),
		// Never paint closed popovers — author display must not override the UA hide.
		css.rule("[popover]:not(:popover-open)", {
			display: "none",
		}),
		css.rule("[popover]:popover-open", {
			padding: "0.25rem",
			border: `1px solid ${bd}`,
			border_radius: "0.375rem",
			background_color: vars.color.surface,
			color: vars.color.surface_text,
			box_shadow: "0 1px 2px rgb(9 9 11 / 0.05), 0 8px 24px rgb(9 9 11 / 0.08)",
		}),
		css.rule("[popover]::backdrop", { background_color: "transparent" }),
		css.rule(
			[
				"menu[popover]:popover-open",
				"[popover]:popover-open menu",
				"[popover]:popover-open .menu",
			],
			{
				display: "flex",
				flex_direction: "column",
				margin: "0",
				padding: "0.25rem",
				list_style: "none",
			},
		),
		css.rule(
			[
				"menu[popover]:popover-open :is(a, button, [role=menuitem])",
				"[popover]:popover-open menu :is(a, button, [role=menuitem])",
			],
			{
				display: "flex",
				align_items: "center",
				gap: "0.5em",
				width: "100%",
				padding: "0.5rem 0.75rem",
				border_radius: "0.25rem",
				color: `color-mix(in oklch, ${vars.color.surface_text}, ${vars.color.surface} 30%)`,
				background: "transparent",
				border: "0",
				font: "inherit",
				text_align: "left",
				cursor: "pointer",
			},
		),
		css.rule(
			[
				"menu[popover]:popover-open :is(a, button, [role=menuitem]).compact",
				"[popover]:popover-open menu.compact :is(a, button, [role=menuitem])",
			],
			{
				padding: "0.35rem 0.5rem",
			},
		),
		css.rule(
			[
				"menu[popover]:popover-open :is(a, button, [role=menuitem]):hover",
				"[popover]:popover-open menu :is(a, button, [role=menuitem]):hover",
			],
			{
				background_color: `color-mix(in oklch, ${vars.color.neutral}, ${vars.color.surface} 90%)`,
				color: vars.color.surface_text,
			},
		),
		css.rule(
			[
				"menu[popover]:popover-open :is(.danger, [data-variant=danger])",
				"[popover]:popover-open menu :is(.danger, [data-variant=danger])",
			],
			{
				color: vars.color.danger,
			},
		),
		css.rule(
			[
				"menu[popover]:popover-open :is(.danger, [data-variant=danger]):hover",
				"[popover]:popover-open menu :is(.danger, [data-variant=danger]):hover",
			],
			{
				background_color: `color-mix(in oklch, ${vars.color.danger}, transparent 90%)`,
				color: vars.color.danger,
			},
		),
		css.rule(["menu[popover] hr", "[popover] menu hr"], {
			border: "0",
			border_top: `1px solid ${bd}`,
			margin: "0.25rem 0",
		}),
		css.rule("[popover]:popover-open.card, [popover].card:popover-open", {
			padding: vars.card.padding.or("1.5rem"),
		}),
		css.rule("iconify-icon", {
			display: "inline-block",
			vertical_align: "-0.125em",
			line_height: "1",
		}),
		css.rule(".tags", {
			display: "flex",
			flex_wrap: "wrap",
			align_items: "center",
			gap: "0.375rem",
			padding: "0.5rem 0.75rem",
			border: `1px solid ${bd}`,
			border_radius: "0.375rem",
			background_color: vars.color.surface,
		}),
		css.rule(".tags input", {
			flex: "1",
			min_width: "8ch",
			border: "0",
			background: "transparent",
			padding: "0",
		}),
		css.rule(".tag", {
			display: "inline-flex",
			align_items: "center",
			gap: "0.25em",
			font_size: "0.75em",
			font_weight: "500",
			padding: "0 0.25em 0 0.625em",
			border_radius: "9999px",
			background_color: `color-mix(in oklch, ${vars.color.neutral}, ${vars.color.surface} 88%)`,
			color: vars.color.surface_text,
			white_space: "nowrap",
		}),
		css.rule(".tag button", {
			display: "inline-flex",
			align_items: "center",
			justify_content: "center",
			aspect_ratio: "1",
			width: "1.5em",
			height: "1.5em",
			padding: "0",
			border: "0",
			background: "transparent",
			font: "inherit",
			line_height: "0",
			color: "inherit",
			cursor: "pointer",
			border_radius: "50%",
			outline: "none",
			box_shadow: "none",
		}),
		css.rule(
			[
				".tag button:hover",
				".tag button.hover",
			],
			{ opacity: "0.6" },
		),
		css.rule(
			[
				".tag button:focus",
				".tag button:focus-visible",
				".tag button:active",
				".tag button.focus",
				".tag button.active",
			],
			{
				outline: "none",
				outline_width: "0px",
				box_shadow: "none",
			},
		),
	);
}

function meter() {
	// Rendered unlayered so browser default meter/progress chrome doesn't win.
	// WebKit and Gecko use different pseudo-elements, so emit per-engine rules
	// rather than combining prefixes; a selector list with an alien prefix is
	// dropped by the other engine. Use the `background` shorthand with
	// !important because browser UA rules render the value via `background` and
	// `background-color` alone doesn't override the visual meter/progress bar.
	const webkitTrack = [
		"progress::-webkit-progress-bar",
		"meter::-webkit-meter-bar",
	];
	const webkitValue = [
		"progress::-webkit-progress-value",
		"meter::-webkit-meter-optimum-value",
		"meter::-webkit-meter-suboptimum-value",
		"meter::-webkit-meter-even-less-good-value",
	];
	const mozValue = ["progress::-moz-progress-bar", "meter::-moz-meter-bar"];
	const bg = (color) => ({ background: `${color} !important` });
	const meterColor = vars.meter.color.or(vars.color.neutral);

	return css.group(
		css.rule(["progress", "meter"], {
			display: "block",
			width: "100%",
			height: vars.progress.height,
			appearance: "none",
			padding: "0",
			border: "0",
			border_radius: "999px",
			overflow: "clip",
			background: "transparent",
		}),
		css.rule(webkitTrack, { background: "transparent" }),
		css.rule(webkitValue, bg(meterColor)),
		css.rule(mozValue, bg(meterColor)),
		...colors.semantic.map((name) =>
			css.rule(
				[
					`progress.${name}`,
					`meter.${name}`,
				],
				{ __meter_color: vars.color[name] },
			),
		),
	);
}

function feedback() {
	return css.group(
		css.rule(".skeleton", {
			display: "block",
			border_radius: vars.border.radius[1],
			background: `linear-gradient(90deg, color-mix(in oklch, ${vars.color.neutral}, ${vars.color.paper} 92%), color-mix(in oklch, ${vars.color.neutral}, ${vars.color.paper} 82%), color-mix(in oklch, ${vars.color.neutral}, ${vars.color.paper} 92%))`,
			background_size: "200% 100%",
			animation: "skeleton-shimmer 1.4s linear infinite",
		}),
		keyframes("skeleton-shimmer", {
			from: { background_position: "200% 0" },
			to: { background_position: "-200% 0" },
		}),
		css.rule(".skeleton.line", { width: "100%", height: "1rem" }),
		css.rule(".row > .skeleton.line", { flex: "1", min_width: "0" }),
		css.rule(".skeleton.box", { width: "4rem", height: "4rem" }),
		css.rule("[aria-busy=true].loading", {
			position: "relative",
			pointer_events: "none",
		}),
		css.rule("[aria-busy=true].loading::after", {
			content: '""',
			position: "absolute",
			inset: "50% auto auto 50%",
			width: "1.5rem",
			height: "1.5rem",
			border: `2px solid ${vars.color.primary}`,
			border_top_color: "transparent",
			border_radius: "50%",
			transform: "translate(-50%, -50%)",
			animation: "loading-spinner 720ms linear infinite",
		}),
		keyframes("loading-spinner", {
			from: { transform: "translate(-50%, -50%) rotate(0deg)" },
			to: { transform: "translate(-50%, -50%) rotate(360deg)" },
		}),
	);
}

function pagination() {
	return css.group(
		css.rule(".pagination", {
			display: "inline-flex",
			padding: "0",
			margin: "0",
			list_style: "none",
			__accent: vars.color.neutral,
		}),
		css.rule(".pagination > *", { display: "flex" }),
		css.rule(".pagination > * > :is(a, .button)", {
			__control_color_base: vars.accent,
			display: "inline-flex",
			align_items: "center",
			justify_content: "center",
			padding: "0.5em 1em",
			border_width: vars.control.border.width.or("1px"),
			border_style: "solid",
			border_color: bd,
			background_color: "transparent",
			color: vars.color.ink,
			border_radius: "0",
		}),
		css.rule(".pagination > *:not(:first-child) > :is(a, .button)", {
			border_left_width: "0",
		}),
		...colors.semantic.map((name) =>
			css.rule(
				[`.pagination.${name}`, `.pagination > * > :is(a, .button).${name}`],
				{
					__accent: vars.color[name],
				},
			),
		),
		css.rule(".pagination > *:first-child > :is(a, .button)", {
			border_top_left_radius: vars.selector.border.radius.or("0.25em"),
			border_bottom_left_radius: vars.selector.border.radius.or("0.25em"),
		}),
		css.rule(".pagination > *:last-child > :is(a, .button)", {
			border_top_right_radius: vars.selector.border.radius.or("0.25em"),
			border_bottom_right_radius: vars.selector.border.radius.or("0.25em"),
		}),
		css.rule(
			".pagination > * > :is(a, .button)[aria-current=page], .pagination > * > :is(a, .button).active",
			{
				__control_background_base: vars.accent,
				__control_background_tint: vars.color.paper,
				__control_background_blend: 1.0,
				__control_background_opacity: 1.0,
				color: `contrast-color(${vars.accent})`,
				background_color: vars.accent,
			},
		),
	);
}

export { meter };

export default css.named({
	pill: pill(),
	status: status(),
	tooltip: tooltip(),
	card: card(),
	breadcrumbs: breadcrumbs(),
	section: section(),
	panels: panels(),
	tree: tree(),
	popover: popover(),
	alert: alert(),
	avatar: avatar(),
	attachment: attachment(),
	native: native(),
	feedback: feedback(),
	pagination: pagination(),
	buttongroup: buttongroup(),
	divider: divider(),
	toast: toast(),
});
// EOF
