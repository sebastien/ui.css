import { vars, on, rule, layer, times } from "../js/littlecss.js";
import { all, inputs, controls } from "./lib/tags.js";

export default layer(
	rule([...all, ".reset"], {
		box_sizing: "border-box",
		margin: "0px",
		padding: "0px",
		margin_block: "unset",
		font_size: "100%",
		font_style: "unset",
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
	rule("body", {
		font_family: `${vars.font.text.family}`,
		font_size: `${vars.font.text.size}`,
		line_height: `${vars.font.text.line}`,
	}),
	rule(inputs, {
		display: `inline-flex`,
		width: `min-content`,
		appearance: "none",
		font_family: `${vars.font.controls}`,
		font_size: `${vars.font.size}`,
		line_height: `${vars.font.lh}`,
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
	rule([times(7, (i) => `h${i + 1}`)], {
		font_family: `${vars.font.heading}`,
		margin: "unset",
		padding: "unset",
		font_size: "unset",
	}),
	rule("summary::-webkit-details-marker", {
		display: "none",
	})
);

// EOF
