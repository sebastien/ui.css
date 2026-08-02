import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";

const stylesheet = await readFile(new URL("../../dist/ui.css", import.meta.url), "utf8");
const material = await readFile(new URL("../../src/css/theme.material.css", import.meta.url), "utf8");
const crm = await readFile(new URL("../../src/css/theme.crm.css", import.meta.url), "utf8");
const select = await readFile(new URL("../../src/css/theme.select.css", import.meta.url), "utf8");
const semanticProperties = [
	"--color-paper",
	"--color-ink",
	"--color-neutral",
	"--color-primary",
	"--color-secondary",
	"--color-tertiary",
	"--color-success",
	"--color-info",
	"--color-warning",
	"--color-danger",
	"--color-error",
	"--color-accent",
];

async function render(page, body, theme = "") {
	await page.setContent(`<style>${stylesheet}</style><style>${theme}</style>${body}`);
}

async function properties(page, selector, names) {
	return page.$eval(
		selector,
		(element, names) => {
			const style = getComputedStyle(element);
			return Object.fromEntries(names.map((name) => [name, style.getPropertyValue(name).trim()]));
		},
		names,
	);
}

test("theme scopes recompute semantic roles", async ({ page }) => {
	for (const [name, theme, paper, ink] of [
		["material", material, "#fafafa", "#212121"],
		["crm", crm, "#ffffff", "#1c2429"],
	]) {
		await render(page, `<body data-theme="${name}"><input id="field"><div id="card" class="card">Card</div></body>`, theme);
		const field = await properties(page, "#field", ["--color-surface", "--color-surface-text", ...semanticProperties]);
		expect(field["--color-surface"]).toBe(paper);
		expect(field["--color-surface-text"]).toBe(ink);
		for (const property of semanticProperties) {
			expect(field[property]).not.toBe("");
		}
	}
});

test("the select theme has self-contained semantic colors", async ({ page }) => {
	await render(page, `<body data-theme="select"><button id="button" class="primary">Save</button></body>`, select);
	const button = await properties(page, "#button", ["--color-primary", "--color-neutral", "--color-surface"]);
	expect(button["--color-primary"]).not.toBe("");
	expect(button["--color-neutral"]).not.toBe("");
	expect(button["--color-surface"]).not.toBe("");
});

test("dark mode overrides a themed surface", async ({ page }) => {
	await render(page, `<body data-theme="material" class="dark"><input id="field"></body>`, material);
	const field = await properties(page, "#field", ["--color-surface", "--color-surface-text"]);
	expect(field["--color-surface"]).toBe("#212121");
	expect(field["--color-surface-text"]).toBe("#fafafa");
	expect(await page.$eval("body", (element) => getComputedStyle(element).backgroundColor)).toBe("rgb(33, 33, 33)");
	expect(await page.$eval("body", (element) => getComputedStyle(element).color)).toBe("rgb(250, 250, 250)");
});

test("neutral outline and ghost actions wash with solid neutral", async ({ page }) => {
	await render(
		page,
		`<button id="outline" class="outline neutral">Outline</button><button id="ghost" class="ghost neutral">Ghost</button>`,
	);
	for (const selector of ["#outline", "#ghost"]) {
		const action = await properties(page, selector, ["--control-background-base", "--color-neutral"]);
		expect(action["--control-background-base"]).toBe(action["--color-neutral"]);
	}
});

test("outline alerts pass their semantic color to nested controls", async ({ page }) => {
	await render(
		page,
		`<div class="alert outline success"><button id="button">Save</button><input id="field"></div>`,
	);
	const alert = await properties(page, ".alert", ["--accent-color"]);
	const button = await properties(page, "#button", ["--accent-color", "--control-color-base"]);
	const field = await page.$eval("#field", (element) => getComputedStyle(element).color);
	const alertColor = await page.$eval(".alert", (element) => getComputedStyle(element).color);

	expect(alert["--accent-color"]).toBe("#22c55e");
	expect(button["--accent-color"]).toBe("#22c55e");
	expect(button["--control-color-base"]).toBe("#22c55e");
	expect(field).toBe(alertColor);
});

test("theme geometry tokens reach actions and fields", async ({ page }) => {
	await render(page, `<body data-theme="material"><button id="action">Save</button><input id="field"></body>`, material);
	const action = await page.$eval("#action", (element) => {
		const style = getComputedStyle(element);
		return { padding: style.padding, radius: style.borderRadius, outline: style.outlineWidth };
	});
	const field = await page.$eval("#field", (element) => getComputedStyle(element).borderRadius);
	expect(action.padding).toBe("0px 16px");
	expect(action.radius).toBe("2px");
	expect(action.outline).toBe("0px");
	expect(field).toBe("0px");
});

test("color apply utilities override control paint", async ({ page }) => {
	await render(
		page,
		`<button id="button" class="primary bg bg-danger tx tx-paper bd bd-warning ol ol-primary">Save</button>`,
	);
	const button = await properties(page, "#button", [
		"--background-color-base",
		"--text-color-base",
		"--border-color-base",
		"--outline-color-base",
	]);
	expect(button["--background-color-base"]).toBe("#ef4444");
	expect(button["--text-color-base"]).toBe("#f8fafc");
	expect(button["--border-color-base"]).toBe("#f59e0b");
	expect(button["--outline-color-base"]).toBe("#0c31bf");
});

test("semantic pills and cards derive paint channels from their accent", async ({ page }) => {
	await render(page, `<span id="pill" class="pill success">Ready</span><article id="card" class="card danger">Danger</article>`);
	for (const [selector, color] of [["#pill", "#22c55e"], ["#card", "#ef4444"]]) {
		const component = await properties(page, selector, ["--accent-color", "--background-color-base", "--border-color-base"]);
		expect(component["--accent-color"]).toBe(color);
		expect(component["--background-color-base"]).toBe(color);
		if (selector === "#card") {
			expect(component["--border-color-base"]).toBe(color);
		}
	}
});
