import { vars, on, root, rule, layer, times } from "../js/uicss.js";
import { all, inputs, controls } from "./lib/tags.js";

export default layer(
	rule([...all, ".reset"], {
		box_sizing: "border-box",
		margin: "0px",
		padding: "0px",
		margin_block: "unset",
		font_style: "inherit",
		font_weight: "inherit",
		font_family: "inherit",
		line_height: "inherit",
		border: "0px solid transparent",
		outline: "0px solid transparent",
		vertical_align: "baseline",
		list_style_type: "none",
		text_rendering: "optimizeLegibility",
		background_color: "transparent",
		box_shadow: "none",
		text_shadow: "none",
		text_align: "unset",
		color: "currentColor",
	}),
	rule(root, {
		font_family: `${vars.font.text.family}`,
		font_size: `${vars.font.size}`,
		font_weight: `${vars.font.weight}`,
		line_height: `${vars.font.line}`,
		webkit_font_smoothing: "antialiased",
		// For "auto" dimensions
		interpolate_size: "allow-keywords",
	}),
	rule(inputs, {
		display: `inline-flex`,
		width: `min-content`,
		min_width: `0`,
		appearance: "none",
		font_family: `${vars.font.controls.family}`,
		font_weight: `${vars.font.controls.weight}`,
		font_size: `${vars.textsize.size[3]}`,
		line_height: `${vars.font.controls.line}`,
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
		},
	),
	rule([times(7, (i) => `h${i + 1}`)], {
		font_family: `${vars.font.heading}`,
		margin: "unset",
		padding: "unset",
		font_size: "unset",
	}),
	rule(["a", "a:link", "a:visited", "a:hover", "a:active", "a:focus"], {
		color: "inherit",
		text_decoration: "none",
	}),
	rule("a[href]", {
		cursor: "pointer",
	}),
	rule("summary::-webkit-details-marker", {
		display: "none",
	}),
);

// EOF
