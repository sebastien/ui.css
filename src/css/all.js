import { layers, group, guard, rule } from "../js/uicss.js";
import tokens from "./tokens.js";
import reset from "./reset.js";
import layout from "./layout.js";
import text from "./text.js";
import style from "./style.js";
import colors, { COLORS } from "./colors.js";
import controls from "./controls.js";
import behavior from "./behavior.js";
import animate from "./animate.js";
import components from "./components.js";

export default (cols = COLORS, { guard: root } = {}) => {
	// Cascade layers, lowest → highest priority:
	//   tokens/reset → component chrome → utilities → motion/behavior → theme
	// Utilities (text/layout/colors/style) sit after controls/components so
	// classes like p-*, m-*, g-*, bg-*, tx-* always override component defaults.
	const res = layers({
		tokens,
		reset,
		controls,
		components,
		text,
		layout,
		colors: colors(cols),
		style,
		animate,
		behavior,
		theme: group(rule(".theme", {})),
	});
	if (!root) {
		return res;
	}
	return guard(res, root);
};
// EOF
