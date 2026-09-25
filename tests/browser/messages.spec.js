import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { installContrast } from "./support/contrast.js";

const stylesheet = await readFile(
	new URL("../../dist/ui.css", import.meta.url),
	"utf8",
);

// Semantic text (alerts, form errors, danger menu items) must keep its hue but
// clear AA on its tint in both modes. Raw red/green/amber text on a pale tint
// was 2–3.9:1; the rules mix toward the text pole in srgb.
const samples = [
	["alert.success", `<div class="alert success" id="x">Alert</div>`],
	["alert.warning", `<div class="alert warning" id="x">Alert</div>`],
	["alert.danger", `<div class="alert danger" id="x">Alert</div>`],
	["alert.error", `<div class="alert error" id="x">Alert</div>`],
	["alert.info", `<div class="alert info" id="x">Alert</div>`],
	["alert.soft.danger", `<div class="alert soft danger" id="x">Alert</div>`],
	["alert.outline.success", `<div class="alert outline success" id="x">Alert</div>`],
	["alert.outline.danger", `<div class="alert outline danger" id="x">Alert</div>`],
	["error", `<p class="error" id="x">Error text</p>`],
];

test("semantic message text meets AA in both modes", async ({ page }) => {
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
			// Danger menu item needs an open popover.
			host.innerHTML = `<menu popover id="m"><button class="danger" id="x">Delete</button></menu>`;
			const menu = document.getElementById("m");
			menu.showPopover();
			out["menu.danger"] = window.__contrast.score(
				document.getElementById("x"),
			);
			menu.hidePopover();
			host.remove();
			return out;
		};
		return { light: run("light"), dark: run("dark") };
	}, samples);

	for (const mode of ["light", "dark"]) {
		for (const name of [...samples.map(([name]) => name), "menu.danger"]) {
			expect(report[mode][name], `${name} in ${mode}`).toBeGreaterThanOrEqual(
				4.5,
			);
		}
	}
});
