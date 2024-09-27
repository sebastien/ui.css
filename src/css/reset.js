import { all, inputs, controls } from "./lib/tags.js";
import { on, rule, layer } from "../js/littlecss.js";

export default layer(
	rule([...all, ".reset"], {
		box_sizing: "border-box",
		margin: "0px",
		padding: "0px",
		margin_block: "unset",
		font_size: "100%",
		font_weight: "unset",
		line_height: "unset",
		border: "0px solid transparent",
		outline: "0px solid transparent",
		vertical_align: "baseline",
		list_style_type: "none",
		text_rendering: "optimizeLegibility",
		background_color: "transparent",
		box_shadow: "none",
		text_shadow: "none",
		text_align: "unset",
		color: "default",
	}),
	rule(inputs, {
		display: `inline-flex`,
		width: `min-content`,
		appearance: "none",
	}),
	rule(
		[
			"*[contenteditable]",
			...controls,
			...on.active(controls),
			on.focus(controls),
		],
		{
			outline: "0px solid transparent",
		}
	),
	rule("summary::-webkit-details-marker", {
		display: "none",
	})
);

// EOF
