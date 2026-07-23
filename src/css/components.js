import css, { keyframes, media, vars } from "../js/uicss.js";
import { colormix } from "./colors.js";
import colors from "./colors.js";

function pill(...rest) {
	return css.nesting(
		[".pill", ".badge"],
		{},
		css.rule("&", {
			// Box
			display: "inline-flex",
			padding: "0.25em 1em",
			font_size: "0.75em",
			font_weight: "500",
			align_items: "center",
			white_space: "nowrap",
			gap: vars.gap,
			line_height: "1.15em",
			// Border
			border_width: "1px",
			border_style: "solid",
			border_color: "transparent",
			border_radius: "9999px",
			// Pill color drives text and border variants; background uses the bg channel.
			__pill_color: vars.color.neutral,
			__background_color_base: vars.color.neutral,
			__background_color_tint: vars.color.paper,
			__background_color_blend: 1.0,
			__background_color_opacity: 1.0,
			background_color: vars.background.color,
			color: vars.color.paper,
		}),
		css.rule("&.dot > *:first-child:before", {
			display: "inline-block",
			content: '""',
			width: "0.65em",
			height: "0.65em",
			margin_right: vars.gap,
			border_radius: "50%",
			background_color: "currentColor",
		}),
		css.rule("&.compact", {
			padding: "0.125em 0.5em",
		}),
		css.rule("&.expanded", {
			padding: "0.5em 1.25em",
		}),
		// Color variants: solid color bg with light text
		...colors.names.map((color) =>
			css.rule(css.mods("&", color), {
				__pill_color: vars.color[color],
				__background_color_base: vars.color[color],
				color: vars.color.paper,
				border_color: "transparent",
			}),
		),
		// Secondary: light grey bg with dark text
		css.rule("&.secondary", {
			__background_color_base: vars.color.neutral,
			__background_color_tint: vars.color.paper,
			__background_color_blend: 0.1,
			__background_color_opacity: 1.0,
			color: vars.color.ink,
			border_color: "transparent",
		}),
		// Tinted: color @ 10% bg with full color text
		css.rule("&.tinted", {
			__background_color_base: "var(--pill-color)",
			__background_color_tint: "transparent",
			__background_color_blend: 0.1,
			__background_color_opacity: 1.0,
			color: `var(--pill-color)`,
			border_color: "transparent",
		}),
		// Outline: transparent bg with color border and darkened text
		css.rule("&.outline", {
			__background_color_base: "var(--pill-color)",
			__background_color_tint: vars.color.paper,
			__background_color_blend: 1.0,
			__background_color_opacity: 0,
			border_color: `color-mix(in oklch, var(--pill-color), ${vars.color.paper} 60%)`,
			color: `color-mix(in oklch, var(--pill-color), ${vars.color.ink} 40%)`,
		}),
		...rest,
	);
}

function tooltip(...rest) {
	return css.nesting(
		[".tooltip"],
		{},
		css.rule("&", {
			position: "absolute",
			display: "block",
			position_anchor: vars.tooltip.anchor.or("top"),
			position_area: vars.tooltip.area.or("center"),
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
			border_color: colors.mixed(
				vars.status.color.base.or(vars.color.neutral),
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
			color: `contrast-color(${vars.status.color.base.or(vars.color.neutral)})`,
		}),
		// Color variants
		...colors.names.map((color) =>
			css.rule(css.mods(["&", "& > *"], color), {
				__status_color_base: vars.color[color],
			}),
		),
		css.rule("& > *", {
			display: "inline-block",
			border_radius: vars.status.border.radius.or("1em"),
			width: "2em",
			height: "0.25em",
			background_color: colors.mixed(
				vars.status.color.base.or(vars.color.neutral),
				vars.status.color.tint.or(vars.color.paper),
				1.0,
				1.0,
			),
		}),
		css.rule("&.outline > *", {
			background_color: "transparent",
			border_width: vars.status.border.size.or("1px"),
			border_color: colors.mixed(
				vars.status.color.base.or(vars.color.neutral),
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
			// Border
			border_width: vars.card.border.size.or("1px"),
			border_radius: vars.card.border.radius.or("0.5em"),
			border_color: colors.mixed(
				vars.card.color.base.or(vars.color.neutral),
				vars.card.color.tint.or(vars.color.paper),
				0.35,
				1.0,
			),
			// Background
			background_color: colors.mixed(
				vars.card.color.base.or(vars.color.neutral),
				vars.card.color.tint.or(vars.color.paper),
				vars.card.color.blend.or(0.1),
				vars.card.color.alpha.or(1.0),
			),
		}),
		// Color variants
		...colors.names.map((color) =>
			css.rule(css.mods("&", color), {
				__control_color_base: vars.color[color],
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
	return css.group(
		css.rule("details.section", {
			border: `1px solid oklch(from ${vars.border.base} calc(l + (${vars.border.l} - 5) * 0.1) c h / calc(${vars.border.o} / 9))`,
			border_radius: `${vars.border.radius[1]}`,
			margin_bottom: `${vars.margin[2]}`,
		}),

		css.rule("details.section summary", {
			cursor: "pointer",
			user_select: "none",
			padding: `${vars.pad[2]}`,
			background_color: `oklch(from ${vars.background.base} calc(l + (7 - 5) * 0.1) c h / calc(${vars.background.o} / 9))`,
			border_radius: `${vars.border.radius[1]} ${vars.border.radius[1]} 0 0`,
			font_weight: "600",
			transition: "background-color 0.2s ease",
		}),

		css.rule("details.section summary:hover", {
			background_color: `oklch(from ${vars.background.base} calc(l + (6 - 5) * 0.1) c h / calc(${vars.background.o} / 9))`,
		}),

		css.rule("details.section summary:before", {
			content: "'▸'",
			display: "inline-block",
			margin_right: `${vars.gap[1]}`,
			transition: "transform 0.2s ease",
			transform_origin: "center",
		}),

		css.rule("details.section[open] summary:before", {
			transform: "rotate(90deg)",
		}),

		css.rule("details.section[open] summary", {
			border_radius: `${vars.border.radius[1]} ${vars.border.radius[1]} 0 0`,
			border_bottom: `1px solid oklch(from ${vars.border.base} calc(l + (${vars.border.l} - 5) * 0.1) c h / calc(${vars.border.o} / 9))`,
		}),

		css.rule("details.section > *:not(summary)", {
			padding: `${vars.pad[2]}`,
		}),
	);
}

function panels() {
	return css.group(
		css.rule(".panels", {
			width: "100%",
			position: "relative",
			overflow: "hidden",
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
	return css.group(
		css.rule("details.tree", {
			__tree_indent: "1em",
			border_top: `1px solid oklch(from ${vars.border.base} calc(l + (${vars.border.l} - 5) * 0.1) c h / calc(${vars.border.o} / 9))`,
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
		css.rule(["[role=alert]", ".alert"], {
			display: "block",
			font_size: "0.875em",
			padding: vars.alert.padding,
			border_width: "1px",
			border_style: "solid",
			border_radius: vars.alert.border.radius,
			border_color: `color-mix(in oklch, ${vars.color.neutral}, ${vars.color.paper} 80%)`,
			background_color: vars.color.paper,
			color: vars.color.ink,
		}),
		...[
			["success", vars.color.success],
			["warning", vars.color.warning],
			["danger", vars.color.danger],
			["error", vars.color.error],
			["info", vars.color.info],
		].map(([name, color]) =>
			css.rule([`[role=alert].${name}`, `.alert.${name}`], {
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
			css.rule([`[role=alert].ghost.${name}`, `.alert.ghost.${name}`], {
				border_width: "1px",
				background_color: "transparent",
				border_color: `${color}`,
				color: `${color}`,
			}),
		),
		css.rule(["[role=alert].ghost", ".alert.ghost"], {
			border_width: "1px",
			background_color: "transparent",
			border_color: `color-mix(in oklch, ${vars.color.neutral}, ${vars.color.paper} 80%)`,
			color: vars.color.ink,
		}),
	);
}

function avatar() {
	return css.group(
		css.rule(["figure.avatar", "figure[data-avatar]"], {
			display: "inline-grid",
			place_items: "center",
			width: vars.avatar.size,
			height: vars.avatar.size,
			margin: "0",
			overflow: "hidden",
			border_radius: "50%",
			background_color: `color-mix(in oklch, ${vars.color.neutral}, ${vars.color.paper} 82%)`,
			color: `color-mix(in oklch, ${vars.color.neutral}, ${vars.color.ink} 52%)`,
			font_weight: "600",
		}),
		css.rule(["figure.avatar img", "figure[data-avatar] img"], {
			width: "100%",
			height: "100%",
			object_fit: "cover",
		}),
		css.rule([".avatar.small", "[data-avatar].small"], {
			width: vars.avatar.small,
			height: vars.avatar.small,
		}),
		css.rule([".avatar.large", "[data-avatar].large"], {
			width: vars.avatar.large,
			height: vars.avatar.large,
		}),
		css.rule(".avatars", { display: "flex", padding_left: "0.35rem" }),
		css.rule(".avatars > :is(.avatar, [data-avatar])", {
			margin_left: "-0.35rem",
			border: `2px solid ${vars.color.paper}`,
		}),
	);
}

function native() {
	return css.group(
		css.rule("details.accordion", {
			border: `1px solid color-mix(in oklch, ${vars.color.ink}, ${vars.color.paper} 84%)`,
			border_radius: vars.border.radius[2],
			background_color: vars.color.paper,
		}),
		css.rule("details.accordion + details.accordion", {
			margin_top: "-1px",
			border_top_left_radius: "0",
			border_top_right_radius: "0",
		}),
		css.rule("details.accordion summary", {
			padding: "0.8rem 1rem",
			cursor: "pointer",
			font_weight: "600",
		}),
		css.rule("details.accordion > :not(summary)", { padding: "0 1rem 1rem" }),
		css.rule("dialog", {
			width: `min(${vars.dialog.width}, calc(100vw - 2rem))`,
			max_height: "85vh",
			padding: "0",
			border: `1px solid color-mix(in oklch, ${vars.color.neutral}, ${vars.color.paper} 80%)`,
			border_radius: "0.75rem",
			background_color: vars.color.paper,
			color: vars.color.ink,
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
		css.rule("dialog > footer", { justify_content: "flex-end", margin_top: "1.25rem" }),
		// Never paint closed popovers — author display must not override the UA hide.
		css.rule("[popover]:not(:popover-open)", {
			display: "none",
		}),
		css.rule("[popover]:popover-open", {
			padding: "0.25rem",
			border: `1px solid color-mix(in oklch, ${vars.color.neutral}, ${vars.color.paper} 80%)`,
			border_radius: "0.375rem",
			background_color: vars.color.paper,
			color: vars.color.ink,
			box_shadow: "0 1px 2px rgb(9 9 11 / 0.05), 0 8px 24px rgb(9 9 11 / 0.08)",
		}),
		css.rule("[popover]::backdrop", { background_color: "transparent" }),
		css.rule(
			["menu[popover]:popover-open", "[popover]:popover-open menu", "[popover]:popover-open .menu"],
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
				color: `color-mix(in oklch, ${vars.color.ink}, ${vars.color.paper} 30%)`,
				background: "transparent",
				border: "0",
				font: "inherit",
				text_align: "left",
				cursor: "pointer",
			},
		),
		css.rule(
			[
				"menu[popover]:popover-open :is(a, button, [role=menuitem]):hover",
				"[popover]:popover-open menu :is(a, button, [role=menuitem]):hover",
			],
			{
				background_color: `color-mix(in oklch, ${vars.color.neutral}, ${vars.color.paper} 90%)`,
				color: vars.color.ink,
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
			border_top: `1px solid color-mix(in oklch, ${vars.color.neutral}, ${vars.color.paper} 80%)`,
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
			border: `1px solid color-mix(in oklch, ${vars.color.neutral}, ${vars.color.paper} 80%)`,
			border_radius: "0.375rem",
			background_color: vars.color.paper,
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
			background_color: `color-mix(in oklch, ${vars.color.neutral}, ${vars.color.paper} 88%)`,
			color: vars.color.ink,
			white_space: "nowrap",
		}),
		css.rule(".tag button", {
			display: "inline-flex",
			align_items: "center",
			justify_content: "center",
			border: "0",
			background: "transparent",
			padding: "0 0.375em",
			font: "inherit",
			line_height: "1",
			color: "inherit",
			cursor: "pointer",
			border_radius: "9999px",
		}),
		css.rule(".tag button:hover", { opacity: "0.6" }),
	);
}

function feedback() {
	return css.group(
		css.rule(["progress", "meter"], {
			display: "block",
			width: "100%",
			height: vars.progress.height,
			border: "0",
			border_radius: "999px",
			overflow: "hidden",
			background_color: `color-mix(in oklch, ${vars.color.neutral}, ${vars.color.paper} 84%)`,
		}),
		css.rule("progress::-webkit-progress-bar", {
			background_color: `color-mix(in oklch, ${vars.color.neutral}, ${vars.color.paper} 84%)`,
		}),
		css.rule("progress::-webkit-progress-value", { background_color: vars.color.primary }),
		css.rule("progress::-moz-progress-bar", { background_color: vars.color.primary }),
		css.rule("meter::-webkit-meter-bar", {
			background_color: `color-mix(in oklch, ${vars.color.neutral}, ${vars.color.paper} 84%)`,
		}),
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
		css.rule("[aria-busy=true].loading", { position: "relative", pointer_events: "none" }),
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
			animation: "spinner 720ms linear infinite",
		}),
	);
}

function composition() {
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
			background_color: vars.color.ink,
			color: vars.color.paper,
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
		css.rule(".buttons", {
			display: "inline-flex",
			padding: "0",
			margin: "0",
			list_style: "none",
		}),
		css.rule(".buttons > *", { display: "flex" }),
		css.rule(".buttons > * > :not(:first-child)", { margin_left: "-1px" }),
		css.rule(".buttons > *:not(:first-child) > *", {
			margin_left: "-1px",
			border_top_left_radius: "0",
			border_bottom_left_radius: "0",
		}),
		css.rule(".buttons > *:not(:last-child) > *", {
			border_top_right_radius: "0",
			border_bottom_right_radius: "0",
		}),
		css.rule(".table", { width: "100%", overflow_x: "auto" }),
		css.rule("table", { width: "100%", min_width: "32rem", border_collapse: "collapse" }),
		css.rule("th", {
			padding: vars.table.padding,
			border_bottom: `1px solid color-mix(in oklch, ${vars.color.ink}, ${vars.color.paper} 84%)`,
			text_align: "left",
			font_weight: "600",
			color: `color-mix(in oklch, ${vars.color.ink}, ${vars.color.paper} 36%)`,
		}),
		css.rule("td", {
			padding: vars.table.padding,
			border_bottom: `1px solid color-mix(in oklch, ${vars.color.ink}, ${vars.color.paper} 90%)`,
		}),
		css.rule("tbody tr:hover", { background_color: `color-mix(in oklch, ${vars.color.primary}, ${vars.color.paper} 96%)` }),
		css.rule(".toast", {
			display: "grid",
			gap: "0.35rem",
			min_width: "18rem",
			padding: "0.9rem 1rem",
			border: `1px solid color-mix(in oklch, ${vars.color.ink}, ${vars.color.paper} 82%)`,
			border_radius: vars.border.radius[2],
			background_color: vars.color.paper,
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
		css.rule(".sidebar-layout", { display: "grid", grid_template_columns: "15rem minmax(0, 1fr)" }),
		css.rule(".sidebar", {
			position: "sticky",
			top: "0",
			height: "100vh",
			min_height: "100vh",
			overflow_y: "auto",
			padding: "1rem",
			border_right: `1px solid color-mix(in oklch, ${vars.color.ink}, ${vars.color.paper} 84%)`,
			background_color: `color-mix(in oklch, ${vars.color.neutral}, ${vars.color.paper} 94%)`,
		}),
		css.rule(".sidebar-layout > main", {
			width: "100%",
			min_width: "0",
			box_sizing: "border-box",
			padding: "1.5rem",
		}),
		media(
			"(max-width: 768px)",
			css.rule(".sidebar-layout", { grid_template_columns: "1fr" }),
			css.rule(".sidebar", {
			position: "static",
			height: "auto",
				min_height: "auto",
				overflow_y: "visible",
				border_right_width: "0",
				border_bottom: `1px solid color-mix(in oklch, ${vars.color.ink}, ${vars.color.paper} 84%)`,
			}),
		),
	);
}

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
	native: native(),
	feedback: feedback(),
	composition: composition(),
});
// EOF
