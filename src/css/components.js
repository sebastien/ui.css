import css, { vars } from "../js/uicss.js";
import { colormix } from "./colors.js";
import colors from "./colors.js";

function badge(...rest) {
	return css.nesting(
		".badge",
		{},
		css.rule("&", {
			// Box
			display: "inline-flex",
			padding: vars.badge.padding.or("0.75em 0.5em"),
			// Border
			border_width: vars.badge.border.size.or("1px"),
			border_color: colors.mixed(
				vars.badge.color.base.or(vars.color.neutral),
				vars.badge.color.tint.or(vars.color.ink),
				0.8,
				1.0,
			),
			background_color: colors.mixed(
				vars.badge.color.base.or(vars.color.neutral),
				vars.badge.color.tint.or(vars.color.paper),
				1.0,
				1.0,
			),
			color: colors.mixed(
				vars.badge.color.base.or(vars.color.neutral),
				vars.badge.color.tint.or(vars.color.ink),
				0.2,
				1.0,
			),
		}),
		// Color variants
		...colors.names.map((color) =>
			css.rule(css.mods("&", color), {
				___color_base: vars.color[color],
			}),
		),
		...rest,
	);
}
function pill() {
	return css.group(
		css.rule(".pill", {
			__pill_tone: vars.color.neutral,
			__pill_contrast: vars.color.paper,
			display: "inline-flex",
			align_items: "center",
			justify_content: "center",
			gap: "0.45em",
			padding: "0.3em 0.8em",
			border_radius: "999px",
			border: "1px solid transparent",
			font_size: "0.82em",
			line_height: "1.2",
			font_weight: "600",
			white_space: "nowrap",
			background: colormix(vars.pill.tone, vars.color.paper, "82%", "100%"),
			color: colormix(vars.pill.tone, vars.color.ink, "58%", "100%"),
			border_color: colormix(vars.pill.tone, vars.color.paper, "66%", "53%"),
		}),
		css.rule(".pill-dot", {
			width: "0.5em",
			height: "0.5em",
			border_radius: "50%",
			background: "currentColor",
			opacity: "0.9",
			flex: "0 0 auto",
		}),
		...[
			["primary", vars.color.primary, vars.color.paper],
			["secondary", vars.color.secondary, vars.color.paper],
			["tertiary", vars.color.tertiary, vars.color.paper],
			["success", vars.color.success, vars.color.paper],
			["warning", vars.color.warning, vars.color.ink],
			["danger", vars.color.danger, vars.color.paper],
			["error", vars.color.danger, vars.color.paper],
			["neutral", vars.color.neutral, vars.color.paper],
		].map(([name, color, contrast]) =>
			css.rule([`.pill.${name}`, `.pill[data-color='${name}']`], {
				__pill_tone: `${color}`,
				__pill_contrast: `${contrast}`,
			}),
		),
		css.rule(".pill[data-inverse='true']", {
			background: vars.pill.tone,
			color: vars.pill.contrast,
			border_color: "transparent",
		}),
		css.rule(".pill[data-inverse='true'] .pill-dot", {
			background: vars.color.paper,
			opacity: "0.95",
		}),
		css.rule(".pill[data-size='small']", {
			font_size: "0.72em",
			padding: "0.22em 0.62em",
		}),
		css.rule(".pill[data-size='medium']", {
			font_size: "0.82em",
			padding: "0.3em 0.8em",
		}),
		css.rule(".pill[data-width='full']", {
			display: "flex",
			width: "100%",
			justify_content: "center",
		}),
	)
}

function status() {
	return css.group(
		css.rule(".status", {
			display: "inline-grid",
			grid_auto_flow: "column",
			align_items: "center",
			gap: "0.32em",
			padding: "0.18em",
			border_radius: "999px",
			background: colormix(vars.color.neutral, vars.color.paper, "88%", "100%"),
			border: `1px solid ${colormix(vars.color.neutral, vars.color.paper, "72%", "48%")}`,
		}),
		css.rule([".status > .start", ".status > .middle", ".status > .end"], {
			width: "1.65em",
			height: "0.45em",
			border_radius: "999px",
			background: colormix(vars.color.neutral, vars.color.paper, "56%", "100%"),
		}),
		css.rule(
			[
				".status > .start",
				".status.success > .start",
				".status.warning > .start",
				".status.error > .start",
			],
			{
				background: vars.color.primary,
			},
		),
		css.rule(".status.success > .middle", {
			background: vars.color.success,
		}),
		css.rule(".status.success > .end", {
			background: colormix(vars.color.success, vars.color.paper, "20%", "100%"),
		}),
		css.rule(".status.warning > .middle", {
			background: vars.color.warning,
		}),
		css.rule(".status.warning > .end", {
			background: colormix(vars.color.warning, vars.color.paper, "20%", "100%"),
		}),
		css.rule(".status.error > .middle", {
			background: vars.color.danger,
		}),
		css.rule(".status.error > .end", {
			background: colormix(vars.color.danger, vars.color.paper, "20%", "100%"),
		}),
	)
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
	)
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
	)
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
			left: `calc(-100% * ${vars.panels.current})`,
			width: `calc(100% * ${vars.panels.count})`,
			min_width: "100%",
			height: "100%",
			grid_template_columns: `repeat(${vars.panels.count}, 1fr)`,
			transition: "left 0.3s ease-in-out",
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
			top: `calc(-100% * ${vars.panels.current})`,
			height: `calc(100% * ${vars.panels.count})`,
			min_height: "100%",
			width: "100%",
			grid_template_rows: `repeat(${vars.panels.count}, 1fr)`,
			transition: "top 0.3s ease-in-out",
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
	)
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
	)
}

export default css.named({
	badge: badge(),
	pill: pill(),
	status: status(),
	breadcrumbs: breadcrumbs(),
	section: section(),
	panels: panels(),
	tree: tree(),
});
// EOF
