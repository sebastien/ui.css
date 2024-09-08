import { tokens, group, times, vars } from "../js/littlecss.js";

const colors = {
	cyan: "#00BCBC",
	blue: "#0000FF",
	purple: "#8000FF",
	red: "#FF0000",
	orange: "#FF7F00",
	yellow: "#BCBC00",
	pink: "#FF00FF",
	green: "#00BC00",
	grey: "#808080",
};

const map = (v, f) => {
	const r = {};
	for (const k in v) {
		r[k] = f(v[k], k);
	}
	return r;
};

export default group(
	tokens({
		color: colors,
	}),
	tokens({
		color: {
			high: `${vars.color.white}`,
			low: `${vars.color.black}`,
		},
	}),
	tokens({
		color: map(colors, (v, k) => ({
			[k]: times(
				11,
				(i) =>
					`color-mix(${vars.color.blend}, ${vars.color[k]}, ${
						i < 5 ? vars.color.low : vars.color.hi
					} ${
						i < 5
							? 100 - Math.round((100 * i) / 5)
							: Math.round((100 * (i - 5)) / 5)
					}%`
			),
		})),
	})
);
