import {
	sides,
	sizes,
	named,
	rule,
	group,
	vars,
	times,
} from "../js/littlecss.js";

export default named({
	pill: group(
		rule(".pill", {
			border: `${vars.border.width} solid ${vars.border.color}`,
			padding: `${vars.pad[0]} ${vars.pad[2]}`,
			border_radius: `2lh`,
		})
	),
});
