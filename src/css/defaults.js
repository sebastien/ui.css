import colors from "./colors.default.js";
// We normalize the colors into a `{[color:string]:string[]}`
const palette = Object.keys(colors).reduce(
	(r, v) => ((r[v] = Object.values(colors[v])), r),
	{}
);
const defaults = {
	palette,
	neutral: palette.gray,
	primary: palette.blue,
	secondary: palette.indigo,
	tertiary: palette.slate,
	colors: [
		"neutral",
		"primary",
		"secondary",
		"tertiary",
		...Object.keys(palette),
	],
};
export default defaults;
// EOF
