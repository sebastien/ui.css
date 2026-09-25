import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { installContrast } from "./support/contrast.js";

const stylesheet = await readFile(
	new URL("../../dist/ui.css", import.meta.url),
	"utf8",
);

// Every tab presentation (regular, group, outline, bar) must keep its label
// readable in both modes, idle and selected. Idle labels mix neutral toward
// the text pole; selected labels use the accent fill with a contrast pole.
const samples = [
	["regular.idle", `<div class="tabs"><button class="tab" id="x">Tab</button></div>`],
	["regular.active", `<div class="tabs"><button class="tab active" aria-selected="true" id="x">Tab</button></div>`],
	["group.idle", `<div class="tabs group"><button class="tab" id="x">Tab</button></div>`],
	["group.active", `<div class="tabs group"><button class="tab active" aria-selected="true" id="x">Tab</button></div>`],
	["outline.idle", `<div class="tabs outline"><button class="tab" id="x">Tab</button></div>`],
	["outline.active", `<div class="tabs outline"><button class="tab active" aria-selected="true" id="x">Tab</button></div>`],
	["bar.idle", `<div class="tabs bar"><button class="tab" id="x">Tab</button></div>`],
	["bar.active", `<div class="tabs bar"><button class="tab active" aria-selected="true" id="x">Tab</button></div>`],
];

test("tab labels meet AA in every presentation and mode", async ({ page }) => {
	await page.setContent(`<style>${stylesheet}</style>`);
	await installContrast(page);

	const report = await page.evaluate((samples) => {
		const run = (mode) => {
			const host = document.createElement("div");
			host.className = mode;
			host.style.padding = "20px";
			document.body.appendChild(host);
			const out = {};
			for (const [name, markup] of samples) {
				host.innerHTML = markup;
				out[name] = window.__contrast.score(document.getElementById("x"));
			}
			host.remove();
			return out;
		};
		return { light: run("light"), dark: run("dark") };
	}, samples);

	for (const mode of ["light", "dark"]) {
		for (const [name] of samples) {
			expect(report[mode][name], `${name} in ${mode}`).toBeGreaterThanOrEqual(
				4.5,
			);
		}
	}
});
