import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { installContrast } from "./support/contrast.js";

const stylesheet = await readFile(
	new URL("../../dist/ui.css", import.meta.url),
	"utf8",
);

// Solid, tinted, and outline pill/badge labels must stay readable on their own
// fill in both modes. The solid fill picks a contrast pole; tinted/outline mix
// the accent toward the text pole in srgb.
const samples = [
	["pill", `<span class="pill" id="x">Pill</span>`],
	["pill.primary", `<span class="pill primary" id="x">Pill</span>`],
	["pill.success", `<span class="pill success" id="x">Pill</span>`],
	["pill.danger", `<span class="pill danger" id="x">Pill</span>`],
	["badge", `<span class="badge" id="x">Badge</span>`],
	["pill.tinted", `<span class="pill tinted" id="x">Pill</span>`],
	["pill.tinted.success", `<span class="pill tinted success" id="x">Pill</span>`],
	["pill.tinted.danger", `<span class="pill tinted danger" id="x">Pill</span>`],
	["pill.outline", `<span class="pill outline" id="x">Pill</span>`],
	["pill.outline.danger", `<span class="pill outline danger" id="x">Pill</span>`],
];

test("pill and badge labels meet AA on their fill in both modes", async ({
	page,
}) => {
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
