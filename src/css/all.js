import { layers, group, rule } from "../js/littlecss.js";
import tokens from "./tokens.js";
import reset from "./reset.js";
import layout from "./layout.js";
import text from "./text.js";
import style from "./style.js";
import colors, { COLORS } from "./colors.js";
import controls from "./controls.js";
import behavior from "./behavior.js";
import components from "./components.js";
export default (cols = COLORS) =>
	layers({
		tokens,
		reset,
		controls,
		components,
		// NOTE: Style should be the last
		text,
		colors: colors(cols),
		layout,
		style,
		behavior,
		theme: group(rule(".theme", {})),
	});
// EOF
