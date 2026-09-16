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
			openVisibility: content(document.getElementById("open")).contentVisibility,
			chevron: getComputedStyle(document.querySelector("#open > summary"), "::after").transform,
			panelDisplay: getComputedStyle(document.getElementById("panel")).display,
		};
	});

	expect(state.closedVisibility).toBe("hidden");
	expect(state.openVisibility).toBe("visible");
	expect(state.closedTransition).toContain("height");
	expect(state.closedTransition).toContain("content-visibility");
	expect(state.closedTransition).toContain("allow-discrete");
	expect(state.chevron).toBe("matrix(-1, 0, 0, -1, 0, 0)");
	expect(state.panelDisplay).toBe("grid");
});
