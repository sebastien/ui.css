import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";

const stylesheet = await readFile(new URL("../../dist/ui.css", import.meta.url), "utf8");

test("compact action padding overrides the action default", async ({ page }) => {
	await page.setContent(
		`<style>${stylesheet}</style>
		<button id="default">Default</button>
		<button id="compact" class="compact">Compact</button>
		<button id="tight" class="tight">Tight</button>`,
	);

	const padding = await page.$$eval("button", (buttons) =>
		buttons.map((button) => getComputedStyle(button).padding),
	);

	// Tight adds a 0.75em font step, so its em padding resolves against 12px
	// (0.1em 0.15em) and is intentionally smaller than compact's 16px base.
	expect(padding).toEqual(["8px 12.8px", "2.4px 4px", "1.2px 1.8px"]);
});

test("compact tabs tighten padding across every presentation", async ({ page }) => {
	await page.setContent(
		`<style>${stylesheet}</style>
		<div id="plain" class="tabs"><button id="plain-default" class="tab">A</button><button id="plain-per-tab" class="tab compact">B</button></div>
		<div id="plain-compact" class="tabs compact"><button id="plain-container" class="tab">A</button></div>
		<div id="bar" class="tabs bar"><button id="bar-default" class="tab">A</button></div>
		<div id="bar-compact" class="tabs bar compact"><button id="bar-container" class="tab">A</button></div>
		<div id="group" class="tabs group"><button id="group-default" class="tab">A</button></div>
		<div id="group-compact" class="tabs group compact"><button id="group-container" class="tab">A</button></div>
		<div id="outline" class="tabs outline"><button id="outline-default" class="tab">A</button></div>
		<div id="outline-compact" class="tabs outline compact"><button id="outline-container" class="tab">A</button></div>`,
	);

	const padding = await page.evaluate(() =>
		Object.fromEntries(
			["plain-default", "plain-per-tab", "plain-container", "bar-default", "bar-container", "group-default", "group-container", "outline-default", "outline-container"].map(
				(id) => [id, getComputedStyle(document.getElementById(id)).padding],
			),
		),
	);
	const groupPadding = await page.$eval("#group-compact", (el) => getComputedStyle(el).padding);

	// Compact padding wins over every presentation default (0.35em 0.5em @ 16px).
	for (const id of ["plain-per-tab", "plain-container", "bar-container", "group-container", "outline-container"]) {
		expect(padding[id]).toBe("5.6px 8px");
	}
	// Presentation defaults are untouched.
	expect(padding["plain-default"]).toBe("8px 16px");
	expect(padding["bar-default"]).toBe("8px 16px");
	expect(padding["group-default"]).toBe("8px 13.6px");
	expect(padding["outline-default"]).toBe("8px 13.6px");
	// Only the group container (padded fill) tightens; joined strips stay at 0.
	expect(groupPadding).toBe("3.2px");
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

test("expandable fields keep one height across collapse and expand", async ({ page }) => {
	await page.setContent(
		`<style>${stylesheet}</style>
		<input id="default" class="input expandable" type="search" placeholder="Search" aria-label="Search" />
		<input id="compact" class="input expandable compact small" type="search" placeholder="Search" aria-label="Search" />`,
	);

	const collapsed = await page.evaluate(() =>
		Object.fromEntries(
			["default", "compact"].map((id) => {
				const cs = getComputedStyle(document.getElementById(id));
				return [
					id,
					{
						height: cs.height,
						width: cs.width,
						transitionProperty: cs.transitionProperty,
					},
				];
			}),
		),
	);

	for (const id of ["default", "compact"]) {
		// Only `width` may animate: a height transition turns the collapsed /
		// expanded height mismatch into a visible layout shift.
		expect(collapsed[id].transitionProperty).toBe("width");

		await page.focus(`#${id}`);
		await page.waitForTimeout(250);
		const focused = await page.$eval(`#${id}`, (el) => {
			const cs = getComputedStyle(el);
			return { height: cs.height, width: cs.width };
		});
		expect(focused.height).toBe(collapsed[id].height);
		expect(parseFloat(focused.width)).toBeGreaterThan(parseFloat(collapsed[id].width));

		await page.$eval(`#${id}`, (el) => el.blur());
		await page.waitForTimeout(250);
		const blurred = await page.$eval(
			`#${id}`,
			(el) => getComputedStyle(el).height,
		);
		expect(blurred).toBe(collapsed[id].height);
	}
});
