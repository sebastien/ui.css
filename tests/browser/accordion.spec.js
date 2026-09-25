import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";

const stylesheet = await readFile(new URL("../../dist/ui.css", import.meta.url), "utf8");

test("native accordion collapses and expands with a transition", async ({ page }) => {
	await page.setContent(
		`<style>${stylesheet}</style>
		<details class="accordion" id="closed"><summary>Closed</summary><p>Body</p></details>
		<details class="accordion" id="open" open><summary>Open</summary><p>Body</p></details>
		<div class="accordion" id="panel"><div>Panel</div></div>`,
	);

	const state = await page.evaluate(() => {
		const content = (el) => getComputedStyle(el, "::details-content");
		return {
			closedVisibility: content(document.getElementById("closed")).contentVisibility,
			closedTransition: content(document.getElementById("closed")).transition,
			closedHeight: content(document.getElementById("closed")).height,
			openVisibility: content(document.getElementById("open")).contentVisibility,
			openHeight: content(document.getElementById("open")).height,
			chevron: getComputedStyle(document.querySelector("#open > summary"), "::after").transform,
			markerOrigin: getComputedStyle(document.querySelector("#open > summary"), "::after").transformOrigin,
			markerSize: getComputedStyle(document.querySelector("#open > summary"), "::after").width,
			panelDisplay: getComputedStyle(document.getElementById("panel")).display,
			panelTransition: getComputedStyle(document.getElementById("panel")).transition,
		};
	});

	expect(state.closedVisibility).toBe("hidden");
	expect(state.openVisibility).toBe("visible");
	expect(state.closedTransition).toContain("height");
	expect(state.closedTransition).toContain("content-visibility");
	expect(state.closedTransition).toContain("allow-discrete");
	expect(state.closedHeight).toBe("0px");
	expect(parseFloat(state.openHeight)).toBeGreaterThan(0);
	// The chevron points down when open (90deg); the triangle used 180deg.
	expect(state.chevron).toBe("matrix(0, 1, -1, 0, 0, 0)");
	// Rotation pivot is the center of the fixed square marker box.
	expect(state.markerOrigin).toBe(`${parseFloat(state.markerSize) / 2}px ${parseFloat(state.markerSize) / 2}px`);
	expect(state.panelDisplay).toBe("grid");
	expect(state.panelTransition).toContain("grid-template-rows");
});

test("accordion marker rotation origin is parameterizable", async ({ page }) => {
	await page.setContent(
		`<style>${stylesheet}</style>
		<details class="accordion" id="default" open><summary>Default</summary><p>Body</p></details>
		<details class="accordion origin-bl" id="corner" open><summary>Corner</summary><p>Body</p></details>
		<details class="accordion" id="hooked" open style="--motion-origin-y: top"><summary>Hook</summary><p>Body</p></details>`,
	);

	const state = await page.evaluate(() => {
		const marker = (id) => getComputedStyle(document.querySelector(`#${id} > summary`), "::after");
		return {
			defaultOrigin: marker("default").transformOrigin,
			cornerOrigin: marker("corner").transformOrigin,
			hookedOrigin: marker("hooked").transformOrigin,
		};
	});

	// Default resolves to the box center, so the glyph spins about itself.
	expect(state.defaultOrigin).toBe("10px 10px");
	// A corner class sets both axes (per-axis fallback).
	expect(state.cornerOrigin).toBe("0px 20px");
	// The hook moves only the axis it sets.
	expect(state.hookedOrigin).toBe("10px 0px");
});

test("details-content height interpolates toward auto when opening", async ({ page }) => {
	await page.setContent(
		`<style>${stylesheet}
		:root { --motion-duration-slow: 5s; }</style>
		<details class="accordion" id="acc"><summary>Toggle</summary><p>Body</p></details>`,
	);

	const result = await page.evaluate(async () => {
		const el = document.getElementById("acc");
		const height = () => parseFloat(getComputedStyle(el, "::details-content").height);
		el.open = true;
		await new Promise((resolve) => setTimeout(resolve, 700));
		const mid = height();
		await new Promise((resolve) => setTimeout(resolve, 5000));
		return { mid, final: height() };
	});

	expect(result.mid).toBeGreaterThan(0);
	expect(result.mid).toBeLessThan(result.final);
});
