import { group, vars, blend, rule } from "../js/littlecss.js";
const transparent = [5, 10, 15, 20, 25, 50, 75, 90];
const defaults = {};

const COLOR_NAMES = [
	"white",
	"black",
	"neutral",
	"primary",
	"secondary",
	"tertiary",
	"success",
	"info",
	"warning",
	"danger",
	"error",
];

function shades(prefix, property) {
	return group(
		...[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.95].map((v, i) =>
			rule(`.${prefix}-${i}`, { [`__${property}_shade`]: v }),
		),
	);
}
function opacities(prefix, property) {
	return group(
		...[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.95].map((v, i) =>
			rule(`.${prefix}-${i}`, { [`__${property}_opacity`]: v }),
		),
	);
}

export { COLOR_NAMES };
export default group(
	group(
		rule(".bg", {
			background_color: `oklch(from ${vars.background.color} ${vars.background.shade} c h / ${vars.background.opacity})`,
		}),
		rule(".fg", {
			color: `oklch(from ${vars.text.color} ${vars.text.shade} c h / ${vars.text.opacity})`,
		}),
		rule(".bd", {
			border_color: `oklch(from ${vars.border.color} ${vars.border.shade} c h / ${vars.border.opacity})`,
		}),
		rule(".ot", {
			outline_color: `oklch(from ${vars.outline.color} ${vars.outline.shade} c h / ${vars.outline.opacity})`,
		}),
		// Color bindings
		group(
			...COLOR_NAMES.map((color) =>
				rule(`.bg-${color}`, {
					__background_color: `${vars.color[color]}`,
				}),
			),
			...COLOR_NAMES.map((color) =>
				rule(`.fg-${color}`, {
					__text_color: `${vars.color[color]}`,
				}),
			),
			...COLOR_NAMES.map((color) =>
				rule(`.bd-${color}`, {
					__border_color: `${vars.color[color]}`,
				}),
			),
			...COLOR_NAMES.map((color) =>
				rule(`.ot-${color}`, {
					__outline_color: `${vars.color[color]}`,
				}),
			),
		),
		// Variants
		shades("bg", "background"),
		shades("fg", "text"),
		shades("bd", "border"),
		shades("ot", "outline"),
		opacities("bg", "background"),
		opacities("fg", "text"),
		opacities("bd", "border"),
		opacities("ot", "outline"),

		// Resets
		rule(".bg-no", { __background_color: "transparent" }),
		rule(".bd-no", { __border_color: "transparent" }),
		rule(".fg-no", { __text_color: "transparent" }),
		rule(".ot-no", { __outline_color: "transparent" }),
		rule(".nobg", { background_color: "transparent" }),
		rule(".nobd", { border_color: "transparent" }),
		rule(".nofg", { text_color: "transparent" }),
		rule(".noot", { outline_color: "transparent" }),
	),
);
