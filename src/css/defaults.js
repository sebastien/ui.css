import colors from "./colors.default.js";
// We normalize the colors into a `{[color:string]:string[]}`
const palette = Object.keys(colors).reduce(
	(r, v) => ((r[v] = Object.values(colors[v])), r),
	{}
);
const defaults = {
	palette,
};
export default defaults;
// EOF
