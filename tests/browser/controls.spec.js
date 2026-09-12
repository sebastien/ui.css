import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";

const stylesheet = await readFile(new URL("../../dist/ui.css", import.meta.url), "utf8");

test("compact action padding overrides the action default", async ({ page }) => {
	await page.setContent(
		`<style>${stylesheet}</style>
		<button id="default">Default</button>
		<button id="compact" class="compact">Compact</button>
		<button id="compacted" class="compacted">Compacted</button>`,
	);

	const padding = await page.$$eval("button", (buttons) =>
		buttons.map((button) => getComputedStyle(button).padding),
	);

	expect(padding).toEqual(["8px 12.8px", "2.4px 4px", "1.6px 2.4px"]);
});

test("selector color variants use the same field surface as inputs", async ({ page }) => {
	await page.setContent(
		`<style>${stylesheet}</style>
		<input id="input-white" class="input white">
		<input id="input-primary" class="input primary">
		<div id="selector-white" class="selector horizontal white"><input type="radio"><label>White</label></div>
		<div id="selector-primary" class="selector horizontal primary"><input type="radio"><label>Primary</label></div>`,
	);

	const backgrounds = await page.$$eval("#input-white, #input-primary, #selector-white > label, #selector-primary > label", (elements) =>
		elements.map((element) => getComputedStyle(element).backgroundColor),
	);

	expect(backgrounds[2]).toBe(backgrounds[0]);
	expect(backgrounds[3]).toBe(backgrounds[1]);
});

test("selector toggle matches switch chrome with optional shadow", async ({ page }) => {
	await page.setContent(
		`<style>${stylesheet}</style>
		<div id="group" class="selector toggle">
			<button id="off" type="button" aria-pressed="false">7D</button>
			<button id="on" type="button" aria-pressed="true">1M</button>
		</div>
		<div id="pill" class="selector toggle rounded shadow">
			<button id="pill-on" type="button" aria-pressed="true">1M</button>
		</div>`,
	);

	const values = await page.evaluate(() => {
		const group = getComputedStyle(document.getElementById("group"));
		const off = getComputedStyle(document.getElementById("off"));
		const on = getComputedStyle(document.getElementById("on"));
		const pill = getComputedStyle(document.getElementById("pill"));
		const pillOn = getComputedStyle(document.getElementById("pill-on"));
		return {
			display: group.display,
			radius: group.borderRadius,
			width: group.width,
			offBackground: off.backgroundColor,
			onBackground: on.backgroundColor,
			onShadow: on.boxShadow,
			pillRadius: pill.borderRadius,
			pillOnShadow: pillOn.boxShadow,
		};
	});

	expect(values.display).toBe("inline-flex");
	expect(values.radius).not.toBe("999px");
	expect(values.pillRadius).toBe("999px");
	expect(values.width).not.toBe("44px");
	expect(values.offBackground).toMatch(/rgba\(0, 0, 0, 0\)|\/ 0\)$/);
	expect(values.onBackground).not.toMatch(/rgba\(0, 0, 0, 0\)|\/ 0\)$/);
	expect(values.onShadow).toBe("none");
	expect(values.pillOnShadow).not.toBe("none");
});

test("selector multiple listboxes do not add an outer option border", async ({ page }) => {
	await page.setContent(
		`<style>${stylesheet}</style>
		<select id="select" class="selector multiple" multiple size="3">
			<option>One</option><option selected>Two</option><option>Three</option>
		</select>`,
	);

	const borders = await page.$$eval("#select > option", (options) =>
		options.map((option) => {
			const style = getComputedStyle(option);
			return [style.borderLeftWidth, style.borderRightWidth, style.borderTopWidth, style.borderBottomWidth];
		}),
	);

	expect(borders[0]).toEqual(["0px", "0px", "0px", "1px"]);
	expect(borders[1]).toEqual(["0px", "0px", "0px", "1px"]);
	expect(borders[2]).toEqual(["0px", "0px", "0px", "0px"]);
});

test("disabled selector listboxes dim content without dimming the border", async ({ page }) => {
	await page.setContent(
		`<style>${stylesheet}</style>
		<select id="select" class="selector" disabled>
			<option>One</option><option selected>Two</option>
		</select>`,
	);

	const values = await page.$eval("#select", (select) => {
		const style = getComputedStyle(select);
		const selected = getComputedStyle(select.options[1]);
		return {
			background: style.backgroundColor,
			color: style.color,
			border: style.borderColor,
			selectedBackground: selected.backgroundColor,
			selectedColor: selected.color,
		};
	});

	expect(values.background).toMatch(/rgba\(0, 0, 0, 0\)|\/ 0\)$/);
	expect(values.color).toMatch(/rgba\(.+0\.5\)|\/ 0\.5\)$/);
	expect(values.border).not.toMatch(/rgba\(0, 0, 0, 0\)|\/ 0\)$/);
	expect(values.selectedBackground).toMatch(/rgba\(.+0\.15\)|\/ 0\.15\)$/);
	expect(values.selectedColor).toMatch(/rgba\(.+0\.5\)|\/ 0\.5\)$/);
});
