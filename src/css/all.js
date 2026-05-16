import { layers, group, guard, rule } from "../js/uicss.js";
import tokens from "./tokens.js";
import reset from "./reset.js";
import layout from "./layout.js";
import text from "./text.js";
import style from "./style.js";
import colors, { COLORS } from "./colors.js";
import controls from "./controls.js";
import behavior from "./behavior.js";
import components from "./components.js";

export default (cols = COLORS, { guard: root } = {}) => {
	const res = layers({
		tokens,
		reset,
		controls,
		components,
		behavior,
		layout,
		// NOTE: Style should be the last
		colors: colors(cols),
		text,
		style,
		theme: group(rule(".theme", {})),
	});
	if (!root) {
		return res;
	}
	return guard(res, root);
};
// EOF
