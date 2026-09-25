import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";
import contrast from "../../src/js/contrast.js";
import { BLUE, INK, PAPER } from "../support/colors.js";

const stylesheet = await readFile(
	new URL("../../dist/ui.css", import.meta.url),
	"utf8",
);

// Token endpoints as computed rgb() values.
const ink = "rgb(30, 41, 59)";
const paper = "rgb(248, 250, 252)";

// Solver-derived dark pairs: the policy (ratios) is validated here; the
// browser test validates that the emitted recipes actually apply.
const solver = contrast();
const linkDark = solver.mix(
	BLUE,
	PAPER,
	solver.liftFor(BLUE, INK, 4.5, PAPER),
);
const primaryDark = solver.mix(
	BLUE,
	PAPER,
	solver.liftFor(BLUE, INK, 3.0, PAPER),
);

test("the top-level dark class swaps surfaces, text, and color-scheme", async ({
	page,
}) => {
	await page.setContent(`<style>${stylesheet}</style>
		<main class="bg-def tx-def">
			<div class="bg" id="surface">Surface</div>
			<button id="button">Button</button>
		</main>`);

	await page.evaluate(() => document.documentElement.classList.add("dark"));

	const state = await page.evaluate(() => {
		const style = (selector) =>
			getComputedStyle(document.querySelector(selector));
		const main = style("main");
		const surface = style("#surface");
		return {
			scheme: style("html").colorScheme,
			page: style("html").getPropertyValue("--color-page").trim(),
			mainBackground: main.backgroundColor,
			mainColor: main.color,
			surfaceBase: surface.getPropertyValue("--background-color-base").trim(),
		};
	});

	expect(state.scheme).toBe("dark");
	expect(state.page).toBe("#1e293b");
	expect(state.mainBackground).toBe(ink);
	expect(state.mainColor).toBe(paper);
	expect(state.surfaceBase).toBe("#1e293b");
});

test("a nested dark container re-derives the channels locally", async ({
	page,
}) => {
	await page.setContent(`<style>${stylesheet}</style>
		<div class="light"><div class="bg" id="light-surface">Light</div></div>
		<div class="dark">
			<div class="bg" id="dark-surface">Dark</div>
			<div class="bg-primary bg-2b" id="blend">Blend</div>
		</div>`);

	const state = await page.evaluate(() => {
		const style = (selector) =>
			getComputedStyle(document.querySelector(selector));
		const lightSurface = style("#light-surface");
		const darkSurface = style("#dark-surface");
		return {
			lightBase: lightSurface
				.getPropertyValue("--background-color-base")
				.trim(),
			darkBase: darkSurface.getPropertyValue("--background-color-base").trim(),
			lightPainted: lightSurface.backgroundColor,
			darkPainted: darkSurface.backgroundColor,
			blendTint: style("#blend")
				.getPropertyValue("--background-color-tint")
				.trim(),
		};
	});

	// Channels re-substitute against the swapped roles inside the container.
	expect(state.darkBase).toBe("#1e293b");
	expect(state.lightBase).toBe("#f8fafc");
	expect(state.darkPainted).not.toBe(state.lightPainted);
	expect(state.blendTint).toBe("#1e293b");
});

test("a light container inside dark reverts to light channels", async ({
	page,
}) => {
	await page.setContent(`<style>${stylesheet}</style>
		<div class="dark">
			<div class="light"><div class="bg" id="inner-light">Light</div></div>
			<div class="bg" id="dark-surface">Dark</div>
		</div>`);

	const state = await page.evaluate(() => ({
		innerBase: getComputedStyle(document.querySelector("#inner-light"))
			.getPropertyValue("--background-color-base")
			.trim(),
		innerPainted: getComputedStyle(document.querySelector("#inner-light"))
			.backgroundColor,
		darkPainted: getComputedStyle(document.querySelector("#dark-surface"))
			.backgroundColor,
	}));

	expect(state.innerBase).toBe("#f8fafc");
	expect(state.innerPainted).not.toBe(state.darkPainted);
});

test("color utilities still win over mode channels on the same element", async ({
	page,
}) => {
	// `.dark` and the utility share one element, so the utility has to out-rank
	// the `:where()` mode channel on the same node (not merely inherit over it).
	await page.setContent(`<style>${stylesheet}</style>
		<div class="dark bg-blue bg" id="pinned">Pinned</div>`);

	const state = await page.$eval("#pinned", (el) => {
		const style = getComputedStyle(el);
		return {
			base: style.getPropertyValue("--background-color-base").trim(),
			painted: style.backgroundColor,
			scheme: style.colorScheme,
		};
	});

	// The utility's channel wins, and its paint is no longer clobbered by the
	// mode surface (which previously won at a higher specificity). The color is
	// a `color-mix(in oklch, …)`, so Chromium serializes it in oklch.
	expect(state.base).toBe("#0c31bf");
	expect(state.painted).not.toBe("rgb(30, 41, 59)");
	expect(state.painted).toContain("oklch(");
	expect(state.scheme).toBe("dark");
});

test("dark mode keeps default button labels contrasting with their fill", async ({
	page,
}) => {
	await page.setContent(`<style>${stylesheet}</style>
		<div class="dark">
			<button id="default">Default</button>
			<button id="primary" class="primary">Primary</button>
			<button id="outline" class="outline">Outline</button>
			<a href="#" id="link" class="link">Link</a>
		</div>`);

	const state = await page.evaluate(() => {
		const style = (selector) =>
			getComputedStyle(document.querySelector(selector));
		// Normalize any resolvable color (rgb, oklch, color-mix results) to
		// "#rrggbb" so contrast math and assertions work across spaces.
		const norm = (color) => {
			const ctx = document.createElement("canvas").getContext("2d");
			ctx.fillStyle = "#000000";
			ctx.fillStyle = color;
			return ctx.fillStyle;
		};
		// In-page WCAG ratio for contrast assertions on resolved colors.
		const lum = (color) => {
			const c = norm(color);
			const rgb = c.startsWith("#")
				? [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16) / 255)
				: c
						.match(/[\d.]+/g)
						.slice(0, 3)
						.map((v) => v / 255);
			const [r, g, b] = rgb.map((v) =>
				v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4,
			);
			return 0.2126 * r + 0.7152 * g + 0.0722 * b;
		};
		const ratio = (a, b) => {
			const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
			return (hi + 0.05) / (lo + 0.05);
		};
		return {
			defaultFill: norm(style("#default").backgroundColor),
			defaultLabel: norm(style("#default").color),
			primaryFill: norm(style("#primary").backgroundColor),
			primaryLabel: norm(style("#primary").color),
			outlineLabel: norm(style("#outline").color),
			linkColor: norm(style("#link").color),
			neutral: style("#default").getPropertyValue("--color-neutral").trim(),
			ratio,
		};
	});

	// Default fill flips to the elevated dark surface; contrast-color picks a
	// light label. Outline text follows the mode text role. The lifted links
	// and primary accent resolve through oklch recipes (canvas-normalized
	// colors that stay in oklch serialization).
	expect(state.defaultFill).toBe("#334155");
	expect(state.defaultLabel).toBe("#ffffff");
	expect(state.primaryFill).toContain("oklch(");
	expect(state.primaryFill).not.toBe("rgb(12, 49, 191)");
	expect(state.primaryLabel).toBe("#ffffff");
	expect(state.outlineLabel).toBe("#f8fafc");
	expect(state.linkColor).toContain("oklch(");
	expect(state.linkColor).not.toBe("rgb(12, 49, 191)");
	// Custom properties resolve to their specified recipe (vars substituted,
	// mix not computed) — proves the dark rule swapped the paired token.
	expect(state.neutral).toBe("color-mix(in oklch, #d5d5d5, #1e293b 54.7%)");
	// The solved dark accents meet their floors against the ink page.
	expect(solver.ratio(primaryDark, "#1e293b")).toBeGreaterThanOrEqual(3.0);
	expect(solver.ratio(linkDark, "#1e293b")).toBeGreaterThanOrEqual(4.5);
});

test("the solved dark link meets AA against the page", async ({ page }) => {
	await page.setContent(`<style>${stylesheet}</style>
		<div class="dark"><a href="#" id="link" class="link">Link</a></div>`);

	// Read the true sRGB the browser renders (canvas resolves oklch/color-mix
	// to pixels) and score the actual pair, not the build model.
	const ratio = await page.evaluate(() => {
		const canvas = document.createElement("canvas");
		canvas.width = canvas.height = 1;
		const ctx = canvas.getContext("2d", { willReadFrequently: true });
		const pixel = (color) => {
			ctx.clearRect(0, 0, 1, 1);
			ctx.fillStyle = color;
			ctx.fillRect(0, 0, 1, 1);
			const d = ctx.getImageData(0, 0, 1, 1).data;
			return [d[0], d[1], d[2]];
		};
		const lum = ([r, g, b]) => {
			const f = (v) => {
				v /= 255;
				return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
			};
			return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
		};
		const contrast = (a, b) => {
			const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
			return (hi + 0.05) / (lo + 0.05);
		};
		const link = getComputedStyle(document.getElementById("link"));
		const host = getComputedStyle(document.querySelector(".dark"));
		return contrast(pixel(link.color), pixel(host.backgroundColor));
	});

	expect(ratio).toBeGreaterThanOrEqual(4.5);
});

test("hint text follows the mode surface", async ({ page }) => {
	await page.setContent(`<style>${stylesheet}</style>
		<div class="light"><p class="hint" id="light">Hint</p></div>
		<div class="dark"><p class="hint" id="dark">Hint</p></div>`);

	const state = await page.evaluate(() => {
		const canvas = document.createElement("canvas");
		canvas.width = canvas.height = 1;
		const ctx = canvas.getContext("2d", { willReadFrequently: true });
		const pixel = (color) => {
			ctx.clearRect(0, 0, 1, 1);
			ctx.fillStyle = color;
			ctx.fillRect(0, 0, 1, 1);
			const d = ctx.getImageData(0, 0, 1, 1).data;
			return [d[0], d[1], d[2]];
		};
		const lum = ([r, g, b]) => {
			const f = (v) => {
				v /= 255;
				return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
			};
			return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
		};
		const ratio = (id) => {
			const el = document.getElementById(id);
			const host = el.parentElement;
			const a = lum(pixel(getComputedStyle(el).color));
			const b = lum(pixel(getComputedStyle(host).backgroundColor));
			return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
		};
		return { light: ratio("light"), dark: ratio("dark") };
	});

	// Light output is the legacy ink/paper mix; dark now blends toward the
	// dark surface instead of a fixed light-pole gray.
	expect(state.light).toBeGreaterThan(4.0);
	expect(state.dark).toBeGreaterThan(4.5);
});

test("tabs, pagination, and panels follow the mode surface", async ({ page }) => {
	await page.setContent(`<style>${stylesheet}</style>
		<div class="dark">
			<div class="tabs">
				<button class="tab active" aria-selected="true" id="tab-on">On</button>
				<button class="tab" aria-selected="false" id="tab-off">Off</button>
			</div>
			<div class="tabs group">
				<button class="tab" id="group-tab">Group</button>
			</div>
			<div class="tabs outline">
				<button class="tab active" aria-selected="true" id="outline-on">On</button>
			</div>
			<ul class="pagination">
				<li><a href="#" id="page">1</a></li>
			</ul>
			<div class="panel" id="panel">Panel</div>
		</div>`);

	const state = await page.evaluate(() => {
		const style = (id) => getComputedStyle(document.getElementById(id));
		const g = (id, name) => style(id).getPropertyValue(name).trim();
		return {
			tabOnBg: style("tab-on").backgroundColor,
			tabOnColor: style("tab-on").color,
			tabOffColor: style("tab-off").color,
			groupTabColor: style("group-tab").color,
			outlineOnColor: style("outline-on").color,
			pageColor: style("page").color,
			panelBg: style("panel").backgroundColor,
			panelTint: g("panel", "--background-color-tint"),
		};
	});

	// Selected regular tab paints the (dark) surface solidly — not the
	// degenerate transparent mix — with a readable label.
	expect(state.tabOnBg).toBe("rgb(30, 41, 59)");
	expect(state.tabOnColor).toBe("rgb(248, 250, 252)");
	// Unselected regular tabs stay muted chrome; the label mixes neutral toward
	// the text pole, so it is neither the raw receded neutral nor the page ink.
	// Exact AA scoring for every presentation lives in tabs.spec.js.
	expect(state.tabOffColor).not.toBe("rgb(30, 41, 59)");
	expect(state.groupTabColor).toBe("rgb(248, 250, 252)");
	expect(state.outlineOnColor).toBe("rgb(248, 250, 252)");
	expect(state.pageColor).toBe("rgb(248, 250, 252)");
	// Panels follow the surface beneath instead of staying paper-white: the
	// tint channel resolves to the mode surface (hook undefined at root).
	expect(state.panelTint).toBe("#1e293b");
	// Chromium serializes the oklch-mixed paint; 0.2795 L = #1e293b.
	expect(state.panelBg).toBe("oklch(0.279491 0.0368399 260.048)");
});

test("outline pills keep their accent hue in dark mode", async ({ page }) => {
	await page.setContent(`<style>${stylesheet}</style>
		<div class="dark">
			<span class="pill outline warning" id="warning">Warning</span>
			<span class="pill outline danger" id="danger">Danger</span>
			<span class="pill outline success" id="success">Success</span>
		</div>`);

	// Mixing a saturated accent toward the blue-ish ink pole in oklch
	// interpolates hue by shortest arc: amber (70) swung through pink (328),
	// red (25) through magenta (310). The alpha-fade border keeps the hue.
	const hues = await page.evaluate(() => {
		const borderHue = (id) => {
			const c = getComputedStyle(document.getElementById(id)).borderColor;
			const m = c.match(/oklch\([\d.]+\s+[\d.]+\s+([\d.]+)/);
			return m ? Number(m[1]) : null;
		};
		return {
			warning: borderHue("warning"),
			danger: borderHue("danger"),
			success: borderHue("success"),
		};
	});

	expect(hues.warning).toBeGreaterThanOrEqual(55);
	expect(hues.warning).toBeLessThanOrEqual(85);
	expect(hues.danger).toBeGreaterThanOrEqual(10);
	expect(hues.danger).toBeLessThanOrEqual(40);
	expect(hues.success).toBeGreaterThanOrEqual(135);
	expect(hues.success).toBeLessThanOrEqual(165);
});
