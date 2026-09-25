// ----------------------------------------------------------------------------
//
// CONTRAST SOLVER
//
// ----------------------------------------------------------------------------
// Build-time contrast math for the color system. Pure module: no DSL imports,
// safe to use from tokens.js, colors.js, themes, and tests.
//
// The color system mixes palette colors over the page with alpha (the
// `opacity` channel) and toward a tint (the `blend` channel, in oklch). Both
// are solved here against a target contrast ratio so recipes no longer carry
// magic constants:
//
//   mixFor(fg, bg, target)   minimal alpha such that `fg` composited over
//                            `bg` reaches `target` (WCAG ratio)
//   liftFor(fg, bg, target)  minimal oklch weight toward `toward` such that
//                            the mixed color reaches `target` vs `bg`
//
// The metric is pluggable: pass a `ratio` function to `solver` to swap the
// scoring function; `metrics.wcag` ships as the default and legal standard.

// ----------------------------------------------------------------------------
// SRGB / OKLAB CONVERSIONS
// ----------------------------------------------------------------------------

const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const gam = (c) =>
	c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;

// hex "#rgb" / "#rrggbb" / "#rrggbbaa" → [r, g, b] in 0..1 gamma space.
// Alpha is accepted but dropped; callers composite with an explicit alpha.
function parse(color) {
	let hex = `${color}`.trim().replace(/^#/, "");
	if (hex.length === 3) {
		hex = [...hex].map((c) => c + c).join("");
	}
	if (hex.length === 8) {
		hex = hex.slice(0, 6);
	}
	if (!/^[0-9a-f]{6}$/i.test(hex)) {
		throw new Error(`Unsupported color for solver: ${color}`);
	}
	return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
}

// gamma-space channels → "#rrggbb"
const bytesToHex = (channels) =>
	`#${channels
		.map((c) =>
			Math.round(c * 255)
				.toString(16)
				.padStart(2, "0"),
		)
		.join("")}`;

// linear-space channels → "#rrggbb"
const toHex = (channels) => bytesToHex(channels.map(gam));

// linear sRGB → OKLab (Björn Ottosson's matrices)
const M1 = [
	[0.4122214708, 0.5363325363, 0.0514459929],
	[0.2119034982, 0.6806995451, 0.1073969566],
	[0.0883024619, 0.2817188376, 0.6299787005],
];
const M2 = [
	[0.2104542553, 0.793617785, -0.0040720468],
	[1.9779984951, -2.428592205, 0.4505937099],
	[0.0259040371, 0.7827717662, -0.808675766],
];
const M2i = [
	[1, 0.3963377774, 0.2158037573],
	[1, -0.1055613458, -0.0638541728],
	[1, -0.0894841775, -1.291485548],
];
const M1i = [
	[4.0767416621, -3.3077115913, 0.2309699292],
	[-1.2684380046, 2.6097574011, -0.3413193965],
	[-0.0041960863, -0.7034186147, 1.707614701],
];

const mul = (m, v) =>
	m.map((row) => row[0] * v[0] + row[1] * v[1] + row[2] * v[2]);

// gamma sRGB → OKLab
function oklab(color) {
	const [r, g, b] = parse(color).map(lin);
	const lms = mul(M1, [r, g, b]).map(Math.cbrt);
	return mul(M2, lms);
}

// OKLab → gamma sRGB hex (clamped to the sRGB gamut)
function okhex(lab) {
	const lms = mul(M2i, lab).map((c) => c * c * c);
	const [r, g, b] = mul(M1i, lms).map((c) => Math.min(1, Math.max(0, c)));
	return toHex([r, g, b]);
}

// ----------------------------------------------------------------------------
// MIXING / COMPOSITING (mirrors the CSS the engine emits)
// ----------------------------------------------------------------------------

// Below this oklch chroma a hue is "powerless" and carries over from the
// other color. Chromium marks #f8fafc (C≈0.003) and other near-neutrals as
// hue `none` but keeps hue for #1e293b (C≈0.037), so 1% matches its boundary.
const POWERLESS_CHROMA = 0.01;

// `color-mix(in oklch, a, b W%)` — L/C interpolate linearly, hue takes the
// shorter arc. A near-neutral endpoint contributes no hue, so the result keeps
// the chromatic endpoint's hue, matching CSS (and Chromium) polar interpolation.
function oklchMix(a, b, weight) {
	const [l1, c1, h1] = oklabToOklch(oklab(a));
	const [l2, c2, h2] = oklabToOklch(oklab(b));
	const n1 = c1 < POWERLESS_CHROMA;
	const n2 = c2 < POWERLESS_CHROMA;
	const ha = n1 && !n2 ? h2 : h1;
	const hb = n2 && !n1 ? h1 : h2;
	let dh = hb - ha;
	if (dh > 180) dh -= 360;
	if (dh < -180) dh += 360;
	const h = ha + dh * weight;
	const l = l1 + (l2 - l1) * weight;
	const c = c1 + (c2 - c1) * weight;
	return okhex(oklchToOklab([l, c, ((h % 360) + 360) % 360]));
}

function oklabToOklch([L, a, b]) {
	const c = Math.hypot(a, b);
	const h = c === 0 ? 0 : (Math.atan2(b, a) * 180) / Math.PI;
	return [L, c, (h + 360) % 360];
}

function oklchToOklab([L, c, h]) {
	const rad = (h * Math.PI) / 180;
	return [L, c * Math.cos(rad), c * Math.sin(rad)];
}

// Alpha compositing happens in the color space of the color — gamma sRGB for
// our hex tokens — so `color-mix(fg, transparent a%)` over `bg` is a plain
// per-channel lerp in gamma space.
function over(fg, alpha, bg) {
	const f = parse(fg);
	const b = parse(bg);
	return bytesToHex(f.map((c, i) => c * alpha + b[i] * (1 - alpha)));
}

// ----------------------------------------------------------------------------
// METRICS
// ----------------------------------------------------------------------------

// WCAG 2.x contrast ratio. Luminance is linear in the *linearized* channels.
function luminance(color) {
	const [r, g, b] = parse(color).map(lin);
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

const wcag = (fg, bg) => {
	const a = luminance(fg);
	const b = luminance(bg);
	const [hi, lo] = a >= b ? [a, b] : [b, a];
	return (hi + 0.05) / (lo + 0.05);
};

// Metric registry. A metric is (foreground, background) → score where higher
// is better; ratio-type metrics share the `target` semantics of WCAG.
export const metrics = { wcag };

// ----------------------------------------------------------------------------
// SOLVER
// ----------------------------------------------------------------------------

// Binary-search the minimal parameter in [0, 1] where a monotonically
// increasing score crosses `target`.
function solveMin(score, target) {
	if (score(0) >= target) {
		return 0;
	}
	if (score(1) < target) {
		return null;
	}
	let lo = 0;
	let hi = 1;
	for (let i = 0; i < 40; i++) {
		const mid = (lo + hi) / 2;
		if (score(mid) >= target) {
			hi = mid;
		} else {
			lo = mid;
		}
	}
	// Round up to 1/1000 so rounding can never drop below the target.
	return Math.ceil(hi * 1000) / 1000;
}

// Binary-search the maximal parameter in [0, 1] where a monotonically
// decreasing score still meets `target` (used to recede a color toward a
// pole until it matches a quieter contrast).
function solveMax(score, target) {
	if (score(0) < target) {
		return null;
	}
	if (score(1) >= target) {
		return 1;
	}
	let lo = 0;
	let hi = 1;
	for (let i = 0; i < 40; i++) {
		const mid = (lo + hi) / 2;
		if (score(mid) >= target) {
			lo = mid;
		} else {
			hi = mid;
		}
	}
	// Round down to 1/1000 so rounding can never drop below the target.
	return Math.floor(lo * 1000) / 1000;
}

// Function: solver
// Creates a solver bound to a contrast metric. Defaults to WCAG.
export function solver({ ratio: score = wcag } = {}) {
	// Minimal alpha such that `fg` at that alpha over `bg` scores `target`.
	const mixFor = (fg, bg, target) =>
		solveMin((a) => score(over(fg, a, bg), bg), target);

	// Minimal oklch weight toward `toward` such that the mix scores `target`
	// against `bg`. Assumes `toward` raises the score (lifting a dark-palette
	// color toward paper); returns null when `target` is unreachable.
	const liftFor = (fg, bg, target, toward) =>
		solveMin((w) => score(oklchMix(fg, toward, w), bg), target);

	// Maximal oklch weight toward `toward` such that the mix still scores
	// `target` against `bg`. Assumes `toward` lowers the score — receding a
	// bright color toward the page until it quiets to the target.
	const recedeFor = (fg, bg, target, toward) =>
		solveMax((w) => score(oklchMix(fg, toward, w), bg), target);

	return {
		metric: score === wcag ? "wcag" : "custom",
		ratio: score,
		composite: over,
		mix: oklchMix,
		mixFor,
		liftFor,
		recedeFor,
	};
}

export { luminance, oklab, okhex, parse, wcag };
export default Object.assign(solver, {
	metrics,
	luminance,
	wcag,
	parse,
	oklab,
	okhex,
});
// EOF
