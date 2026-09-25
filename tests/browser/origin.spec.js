import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";

const stylesheet = await readFile(new URL("../../dist/ui.css", import.meta.url), "utf8");

// [class suffix, computed transform-origin, --motion-origin-x, --motion-origin-y]
// A 100x50 box makes the resolved px values read as percentages of the box.
const boxes = [
	["c", "50px 25px", "center", "center"],
	["t", "50px 0px", "center", "top"],
	["b", "50px 50px", "center", "bottom"],
	["l", "0px 25px", "left", "center"],
	["r", "100px 25px", "right", "center"],
	["tl", "0px 0px", "left", "top"],
	["tr", "100px 0px", "right", "top"],
	["bl", "0px 50px", "left", "bottom"],
	["br", "100px 50px", "right", "bottom"],
];

test("origin utilities resolve valid per-axis values", async ({ page }) => {
	await page.setContent(
		`<style>${stylesheet}</style>
		${boxes
			.map(
				([name]) =>
					`<div class="origin-${name}" id="o-${name}" style="width:100px;height:50px"></div>`,
			)
			.join("\n")}`,
	);

	const state = await page.evaluate((names) => {
		const read = (name) => {
			const style = getComputedStyle(document.getElementById(`o-${name}`));
			return {
				origin: style.transformOrigin,
				x: style.getPropertyValue("--motion-origin-x").trim(),
				y: style.getPropertyValue("--motion-origin-y").trim(),
			};
		};
		return Object.fromEntries(names.map((name) => [name, read(name)]));
	}, boxes.map(([name]) => name));

	// A directional class moves a single axis; the unset axis stays centered.
	// The regression this guards: `.origin-t` used to emit `top top`, which is
	// invalid and collapsed every axis to the default center.
	for (const [name, origin, x, y] of boxes) {
		expect(state[name], `.origin-${name}`).toEqual({ origin, x, y });
	}
});

test("motion rules read the per-axis origin channels", async ({ page }) => {
	await page.setContent(`<style>${stylesheet}</style>
		<div class="origin-t open-rotate" id="rotated" style="width:100px;height:50px"></div>
		<div class="origin-c open-rotate" id="centered" style="width:100px;height:50px"></div>`);

	const state = await page.evaluate(() => {
		const g = (id) => getComputedStyle(document.getElementById(id));
		return {
			rotated: g("rotated").transformOrigin,
			centered: g("centered").transformOrigin,
		};
	});

	expect(state.rotated).toBe("50px 0px");
	expect(state.centered).toBe("50px 25px");
});

test("origin channels feed the popover animation origin", async ({ page }) => {
	await page.setContent(`<style>${stylesheet}</style>
		<div class="popover-in" id="default" style="width:100px;height:50px"></div>
		<div class="popover-in origin-bl" id="corner" style="width:100px;height:50px"></div>
		<div class="popover-in" id="hooked" style="width:100px;height:50px;--motion-origin: right bottom"></div>`);

	const state = await page.evaluate(() => {
		const g = (id) =>
			getComputedStyle(document.getElementById(id)).transformOrigin;
		return {
			default: g("default"),
			corner: g("corner"),
			hooked: g("hooked"),
		};
	});

	// Default keeps the historic top-center popover pivot.
	expect(state.default).toBe("50px 0px");
	// A corner class now composes through the per-axis channels.
	expect(state.corner).toBe("0px 50px");
	// The whole-value hook still wins.
	expect(state.hooked).toBe("100px 50px");
});

test("--motion-origin overrides the utility shorthand only", async ({ page }) => {
	await page.setContent(`<style>${stylesheet}</style>
		<div class="origin-t" id="override" style="width:100px;height:50px;--motion-origin: right bottom"></div>
		<div class="origin-t open-rotate" id="motion" style="width:100px;height:50px;--motion-origin: right bottom"></div>`);

	const state = await page.evaluate(() => {
		const g = (id) => getComputedStyle(document.getElementById(id));
		return {
			override: g("override").transformOrigin,
			motion: g("motion").transformOrigin,
			x: g("motion").getPropertyValue("--motion-origin-x").trim(),
			y: g("motion").getPropertyValue("--motion-origin-y").trim(),
		};
	});

	// The whole-value hook replaces the `.origin-*` shorthand on a plain element,
	// but motion rules keep resolving the per-axis channels.
	expect(state.override).toBe("100px 50px");
	expect(state.motion).toBe("50px 0px");
	expect(state.x).toBe("center");
	expect(state.y).toBe("top");
});
