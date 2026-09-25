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
	expect(state.chevron).toBe("matrix(-1, 0, 0, -1, 0, 0)");
	expect(state.panelDisplay).toBe("grid");
	expect(state.panelTransition).toContain("grid-template-rows");
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
