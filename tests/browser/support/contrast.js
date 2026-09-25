// Shared browser-test fixtures. Re-exports the token endpoints so a spec can
// import constants and the contrast helper from one place.
export { INK, PAPER, BLUE, GRAY } from "../../support/colors.js";

// Self-contained source that installs `window.__contrast` in the page. Canvas
// pixel readback resolves oklch()/color-mix() to real sRGB, so specs score what
// the browser actually paints rather than the build model.
const CONTRAST_SOURCE = `
(() => {
	const canvas = document.createElement("canvas");
	canvas.width = canvas.height = 1;
	const ctx = canvas.getContext("2d", { willReadFrequently: true });
	// Parse any resolved CSS color to unpremultiplied [r, g, b, a].
	const rgba = (color) => {
		ctx.clearRect(0, 0, 1, 1);
		ctx.fillStyle = color;
		ctx.fillRect(0, 0, 1, 1);
		const d = ctx.getImageData(0, 0, 1, 1).data;
		return [d[0], d[1], d[2], d[3] / 255];
	};
	const over = (top, bottom) => [
		top[0] * top[3] + bottom[0] * (1 - top[3]),
		top[1] * top[3] + bottom[1] * (1 - top[3]),
		top[2] * top[3] + bottom[2] * (1 - top[3]),
		1,
	];
	const lum = ([r, g, b]) => {
		const f = (v) => {
			v /= 255;
			return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
		};
		return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
	};
	const ratio = (a, b) => {
		const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
		return (hi + 0.05) / (lo + 0.05);
	};
	// Composite ancestor backgrounds from the nearest opaque layer down.
	const effectiveBg = (el) => {
		const chain = [];
		for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
			chain.push(rgba(getComputedStyle(n).backgroundColor));
		}
		let acc = [255, 255, 255, 1];
		for (const layer of chain.reverse()) acc = over(layer, acc);
		return acc;
	};
	const score = (el) => ratio(rgba(getComputedStyle(el).color), effectiveBg(el));
	window.__contrast = { rgba, over, lum, ratio, effectiveBg, score };
})();
`;

// Inject the helper after `page.setContent(...)`. Returns the page for chaining.
export async function installContrast(page) {
	await page.addScriptTag({ content: CONTRAST_SOURCE });
	return page;
}
