import {
	sides,
	classes,
	sizes,
	named,
	rule,
	group,
	vars,
	times,
} from "../js/littlecss.js";
import { inputs } from "./lib/tags.js";

export default named({
	pill: group(
		rule(".pill", {
			border: `${vars.border.width} solid ${vars.border.color}`,
			padding: `${vars.pad[0]} ${vars.pad[2]}`,
			border_radius: `2lh`,
		})
	),
	input: group(
		rule(".input", {
			border: `${vars.border.width} solid ${vars.border.color}`,
			font_family: `${vars.font.control}`,
			padding: `${vars.pad[0]} ${vars.pad[0]}`,
			// NOTE: This is required as numeric fields have an extra height
			// This is so that the padding doesn't interfere.
			box_sizing: "border-box",
			gap: `${vars.gap[1]}`,
		})
	),
});
