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
	tree: group(
		rule("details.tree", {
			__tree_indent: "1em",
			border_top: `1px solid ${vars.color.bd}`,
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
});
