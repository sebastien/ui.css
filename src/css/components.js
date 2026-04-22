import {
	blended,
	classes,
	group,
	named,
	rule,
	sides,
	sizes,
	times,
	vars,
} from "../js/uicss.js";
import { inputs } from "./lib/tags.js";
import { colormix } from "./colors.js";

function colorvars(name, mode = "color") {
	return {
		[`--${name}-current-color-base`]: vars[name][mode].base,
		[`--${name}-current-color-tint`]: vars[name][mode].tint,
		[`--${name}-current-color-blend`]: vars[name][mode].blend,
		[`--${name}-current-color-opacity`]: vars[name][mode].opacity,
		[`--${name}-current-color`]: vars[name].current.color.base,
	}
}

export default named({
	breadcrumbs: group(
		rule(".breadcrumbs", {
			display: "inline-flex",
			flex_wrap: "wrap",
		}),
		rule(".breadcrumbs > li", {
			display: "fleX",
			align_items: "center",
		}),
		rule(".breadcrumbs > li + ::before", {
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
		})
	),

	tree: group(
		rule("details.tree", {
			__tree_indent: "1em",
			border_top: `1px solid oklch(from ${vars.border.base} calc(l + (${vars.border.l} - 5) * 0.1) c h / calc(${vars.border.o} / 9))`,
			border_collapse: "collapse",
		}),
		rule("details.tree[open]", {}),
		rule("details.tree summary", {
			cursor: "pointer",
			user_select: "none",
			padding: `${vars.pad[1]}`,
			padding_left: `calc(${vars.tree.depth} * ${vars.tree.indent})`,
		}),

		rule("details.tree>summary:before", {
			display: "inline-flex",
			align_items: "center",
			justify_content: "center",
			aspect_ratio: 1,
			width: "1em",
			content: "'·'",
		}),

		rule("details.tree[data-icon]>summary:before", {
			content: "attr(data-icon)",
		}),

		rule("details.tree:has(details)>summary:before", {
			content: "'▸'",
		}),

		rule("details.tree[open]:has(details)>summary:before", {
			transform: "rotate(90deg)",
		}),

		rule("details.tree details", {
			__tree_depth: 1,
		}),
		rule("details.tree details details", {
			__tree_depth: 2,
		}),

		rule("details.tree details details details", {
			__tree_depth: 3,
		}),

		rule("details.tree details details details details", {
			__tree_depth: 4,
		}),

		rule("details.tree details details details details details", {
			__tree_depth: 5,
		})
	),

	section: group(
		rule("details.section", {
			border: `1px solid oklch(from ${vars.border.base} calc(l + (${vars.border.l} - 5) * 0.1) c h / calc(${vars.border.o} / 9))`,
			border_radius: `${vars.border.radius[1]}`,
			margin_bottom: `${vars.margin[2]}`,
		}),

		rule("details.section summary", {
			cursor: "pointer",
			user_select: "none",
			padding: `${vars.pad[2]}`,
			background_color: `oklch(from ${vars.background.base} calc(l + (7 - 5) * 0.1) c h / calc(${vars.background.o} / 9))`,
			border_radius: `${vars.border.radius[1]} ${vars.border.radius[1]} 0 0`,
			font_weight: "600",
			transition: "background-color 0.2s ease",
		}),

		rule("details.section summary:hover", {
			background_color: `oklch(from ${vars.background.base} calc(l + (6 - 5) * 0.1) c h / calc(${vars.background.o} / 9))`,
		}),

		rule("details.section summary:before", {
			content: "'▸'",
			display: "inline-block",
			margin_right: `${vars.gap[1]}`,
			transition: "transform 0.2s ease",
			transform_origin: "center",
		}),

		rule("details.section[open] summary:before", {
			transform: "rotate(90deg)",
		}),

		rule("details.section[open] summary", {
			border_radius: `${vars.border.radius[1]} ${vars.border.radius[1]} 0 0`,
			border_bottom: `1px solid oklch(from ${vars.border.base} calc(l + (${vars.border.l} - 5) * 0.1) c h / calc(${vars.border.o} / 9))`,
		}),

		rule("details.section > *:not(summary)", {
			padding: `${vars.pad[2]}`,
		})
	),

	panels: group(
		rule(".panels", {
			width: "100%",
			position: "relative",
			overflow: "hidden",
			__panels_current: "0",
			__panels_count: "2",
		}),

		rule(".panels > .horizontal", {
			position: "relative",
			display: "grid",
			left: "calc(-100% * var(--panels-current))",
			width: "calc(100% * var(--panels-count))",
			min_width: "100%",
			height: "100%",
			grid_template_columns: "repeat(var(--panels-count), 1fr)",
			transition: "left 0.3s ease-in-out",
		}),

		rule(".panels > .horizontal > *", {
			height: "100%",
			max_height: "100%",
			min_height: "100%",
			overflow: "auto",
			border: "0px solid transparent",
			box_sizing: "border-box",
		}),

		rule(".panels > .vertical", {
			position: "relative",
			display: "grid",
			top: "calc(-100% * var(--panels-current))",
			height: "calc(100% * var(--panels-count))",
			min_height: "100%",
			width: "100%",
			grid_template_rows: "repeat(var(--panels-count), 1fr)",
			transition: "top 0.3s ease-in-out",
		}),

		rule(".panels > .vertical > *", {
			height: "100%",
			max_height: "100%",
			min_height: "100%",
			overflow: "auto",
			border: "0px solid transparent",
			box_sizing: "border-box",
		}),

		rule('.panels[data-panels="2"]', {
			__panels_count: "2",
		}),

		rule('.panels[data-panels="3"]', {
			__panels_count: "3",
		}),

		rule('.panels[data-panels="4"]', {
			__panels_count: "4",
		}),

		rule('.panels[data-panels="5"]', {
			__panels_count: "5",
		}),

		rule('.panels[data-panels="6"]', {
			__panels_count: "6",
		}),

		rule('.panels[data-panel="0"]', {
			__panels_current: "0",
		}),

		rule('.panels[data-panel="1"]', {
			__panels_current: "1",
		}),

		rule('.panels[data-panel="2"]', {
			__panels_current: "2",
		}),

		rule('.panels[data-panel="3"]', {
			__panels_current: "3",
		}),

		rule('.panels[data-panel="4"]', {
			__panels_current: "4",
		}),

		rule('.panels[data-panel="5"]', {
			__panels_current: "5",
		})
	),

	panel: group(
		rule(".panel", {
			...colorvars("panel", "color"),
			border_width: `${vars.border.width}`,
			border_style: `${vars.border.style}`,
			border_color: colormix(
				vars.panel.current.color,
				vars.panel.color.tint,
				"14%",
				"100%",
			),
			border_left_width: `${vars.panel.box.accent}`,
			border_left_color: "var(--panel-current-color)",
			border_radius: `${vars.panel.box.radius}`,
			padding: `${vars.panel.box.padding.y} ${vars.panel.box.padding.x}`,
			background: colormix(
				vars.panel.current.color,
				vars.panel.color.tint,
				"4%",
				"100%",
			),
			box_shadow: "none",
		}),
		rule([".panel > *:first-child", ".panel > .t > *:first-child"], {
			margin_top: "0px",
		}),
		rule([".panel > *:last-child", ".panel > .t > *:last-child"], {
			margin_bottom: "0px",
		}),
		...[
			"primary",
			"secondary",
			"tertiary",
			"success",
			"warning",
			"danger",
		].map((variant) =>
			rule(`.panel.${variant}`, {
				__panel_color_base: `${vars.panel.color[variant]}`,
			}),
		),
	),

	badge: group(
		rule(".badge", {
			__badge_tone: vars.color.neutral,
			__badge_contrast: vars.color.paper,
			display: "inline-flex",
			align_items: "center",
			justify_content: "center",
			min_width: "1.65em",
			height: "1.65em",
			padding: "0.2em 0.5em",
			border_radius: "999px",
			font_size: "0.75em",
			line_height: "1",
			font_weight: "700",
			letter_spacing: "0.01em",
			white_space: "nowrap",
			background: "var(--badge-tone)",
			color: "var(--badge-contrast)",
		}),
		rule(".badge[data-variant='number']", {
			padding: "0px",
			width: "1.65em",
		}),
		rule(".badge[data-variant='text']", {
			padding: "0.25em 0.7em",
		}),
		...[
			["primary", vars.color.primary, vars.color.paper],
			["secondary", vars.color.secondary, vars.color.paper],
			["tertiary", vars.color.tertiary, vars.color.paper],
			["success", vars.color.success, vars.color.paper],
			["warning", vars.color.warning, vars.color.ink],
			["danger", vars.color.danger, vars.color.paper],
			["active", vars.color.primary, vars.color.paper],
		].map(([name, color, ink]) =>
			rule([
				`.badge.${name}`,
				`.badge[data-type='${name}']`,
			], {
				__badge_tone: `${color}`,
				__badge_contrast: `${ink}`,
			}),
		),
		rule(".badge[data-type='default']", {
			__badge_tone: vars.color.neutral,
			__badge_contrast: vars.color.paper,
		}),
	),

	pill: group(
		rule(".pill", {
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
			background: colormix(vars.color.neutral, vars.color.paper, "80%", "100%"),
			color: colormix(vars.color.neutral, vars.color.ink, "58%", "100%"),
			border_color: colormix(vars.color.neutral, vars.color.paper, "65%", "55%"),
		}),
		rule(".pill-dot", {
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
			rule([
				`.pill.${name}`,
				`.pill[data-color='${name}']`,
			], {
				__pill_tone: `${color}`,
				__pill_contrast: `${contrast}`,
				background: colormix(`${color}`, vars.color.paper, "85%", "100%"),
				color: colormix(`${color}`, vars.color.ink, "58%", "100%"),
				border_color: colormix(`${color}`, vars.color.paper, "68%", "52%"),
			}),
		),
		rule(".pill[data-inverse='true']", {
			background: "var(--pill-tone)",
			color: "var(--pill-contrast)",
			border_color: "transparent",
		}),
		rule(".pill[data-inverse='true'] .pill-dot", {
			background: vars.color.paper,
			opacity: "0.95",
		}),
		rule(".pill[data-size='small']", {
			font_size: "0.72em",
			padding: "0.22em 0.62em",
		}),
		rule(".pill[data-size='medium']", {
			font_size: "0.82em",
			padding: "0.3em 0.8em",
		}),
		rule(".pill[data-width='full']", {
			display: "flex",
			width: "100%",
			justify_content: "center",
		}),
	),

	status_loader: group(
		rule(".status-loader", {
			display: "inline-grid",
			grid_auto_flow: "column",
			align_items: "center",
			gap: "0.32em",
			padding: "0.18em",
			border_radius: "999px",
			background: colormix(vars.color.neutral, vars.color.paper, "88%", "100%"),
			border: `1px solid ${colormix(vars.color.neutral, vars.color.paper, "72%", "48%")}`,
		}),
		rule([
			".status-loader > .start",
			".status-loader > .middle",
			".status-loader > .end",
		], {
			width: "1.65em",
			height: "0.45em",
			border_radius: "999px",
			background: colormix(vars.color.neutral, vars.color.paper, "56%", "100%"),
		}),
		rule([
			".status-loader > .start",
			".status-loader[data-success] > .start",
			".status-loader[data-warning] > .start",
			".status-loader[data-error] > .start",
		], {
			background: vars.color.primary,
		}),
		rule(".status-loader[data-success] > .middle", {
			background: vars.color.success,
		}),
		rule(".status-loader[data-success] > .end", {
			background: colormix(vars.color.success, vars.color.paper, "20%", "100%"),
		}),
		rule(".status-loader[data-warning] > .middle", {
			background: vars.color.warning,
		}),
		rule(".status-loader[data-warning] > .end", {
			background: colormix(vars.color.warning, vars.color.paper, "20%", "100%"),
		}),
		rule(".status-loader[data-error] > .middle", {
			background: vars.color.danger,
		}),
		rule(".status-loader[data-error] > .end", {
			background: colormix(vars.color.danger, vars.color.paper, "20%", "100%"),
		}),
	),
});
