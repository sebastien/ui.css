import {
	sides,
	classes,
	sizes,
	named,
	rule,
	group,
	vars,
	times,
	blended,
} from "../js/littlecss.js";
import { inputs } from "./lib/tags.js";

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
		}),
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
		}),
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
		}),
	),
});
