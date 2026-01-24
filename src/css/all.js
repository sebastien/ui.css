import { layers } from "../js/littlecss.js";
import tokens from "./tokens.js";
import reset from "./reset.js";
import layout from "./layout.js";
import text from "./text.js";
import style from "./style.js";
import colors from "./colors.js";
import controls from "./controls.js";
import behavior from "./behavior.js";
import components from "./components.js";
export default layers({
	tokens,
	reset,
	controls,
	components,
	// NOTE: Style should be the last
	text,
	colors,
	layout,
	style,
	behavior,
});
// EOF
