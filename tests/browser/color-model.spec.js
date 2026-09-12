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

test("color reset wrappers restore channel defaults while child utilities win", async ({ page }) => {
	await render(
		page,
		`<div class="bg-3o tx-3o bd-3o ol-3o reset-bg reset-txt reset-bd reset-ol">
			<div id="default">Default</div>
			<div id="custom" class="bg-8o tx-8o bd-8o ol-8o">Custom</div>
		</div>`,
	);
	const values = await page.$$eval("#default, #custom", (elements) =>
		elements.map((element) => {
			const style = getComputedStyle(element);
			return [
				style.getPropertyValue("--background-color-opacity").trim(),
				style.getPropertyValue("--text-color-opacity").trim(),
				style.getPropertyValue("--border-color-opacity").trim(),
				style.getPropertyValue("--outline-color-opacity").trim(),
			];
		}),
	);
	expect(values[0]).toEqual(["1", "1", "0.35", "0.8"]);
	expect(values[1]).toEqual(["0.8", "0.8", "0.8", "0.8"]);
});

test("color reset wrappers clear border and outline widths", async ({ page }) => {
	await render(
		page,
		`<div class="reset-bd reset-ol"><div id="reset" class="bd-3 ol-3">Reset</div></div>`,
	);
	const values = await page.$eval("#reset", (element) => {
		const style = getComputedStyle(element);
		return [style.borderTopWidth, style.outlineWidth];
	});
	expect(values).toEqual(["0px", "0px"]);
});

test("switch shadow is optional and outline switches fill when checked", async ({ page }) => {
	await render(
		page,
		`<input id="flat" type="checkbox" role="switch">
		<input id="shadow" class="shadow" type="checkbox" role="switch">
		<input id="outline-off" class="outline" type="checkbox" role="switch">
		<input id="outline-on" class="outline" type="checkbox" role="switch" checked>
		<input id="outline-primary" class="outline primary" type="checkbox" role="switch" checked>`,
	);
	const switches = await page.$$eval("input", (elements) =>
		elements.map((element) => {
			const style = getComputedStyle(element);
			const knob = getComputedStyle(element, "::before");
			return {
				background: style.backgroundColor,
				border: style.borderColor,
				shadow: knob.boxShadow,
			};
		}),
	);
	expect(switches[0].shadow).toBe("none");
	expect(switches[1].shadow).not.toBe("none");
	expect(switches[2].background).toMatch(/rgba\(0, 0, 0, 0\)|\/ 0\)$/);
	expect(switches[3].background).not.toMatch(/rgba\(0, 0, 0, 0\)|\/ 0\)$/);
	expect(switches[4].background).not.toMatch(/rgba\(0, 0, 0, 0\)|\/ 0\)$/);
	expect(switches[2].border).not.toMatch(/rgba\(0, 0, 0, 0\)|\/ 0\)$/);
});

test("unchecked checkboxes retain a visible border", async ({ page }) => {
	for (const mode of ["", "dark"]) {
		await render(page, `<body class="${mode}"><input id="checkbox" type="checkbox"></body>`);
		const checkbox = await page.$eval("#checkbox", (element) => {
			const style = getComputedStyle(element);
			return {
				borderColor: style.borderColor,
				borderStyle: style.borderStyle,
				borderWidth: style.borderWidth,
			};
		});
		expect(checkbox.borderWidth).toBe("1px");
		expect(checkbox.borderStyle).toBe("solid");
		expect(checkbox.borderColor).not.toBe("rgba(0, 0, 0, 0)");
	}
});

test("outline fields have transparent backgrounds and visible borders", async ({ page }) => {
	await render(page, `<input id="field" class="outline primary">`);
	const field = await page.$eval("#field", (element) => {
		const style = getComputedStyle(element);
		return {
			backgroundColor: style.backgroundColor,
			borderColor: style.borderColor,
			borderStyle: style.borderStyle,
			borderWidth: style.borderWidth,
		};
	});

	expect(field.backgroundColor).toBe("rgba(0, 0, 0, 0)");
	expect(field.borderWidth).toBe("1px");
	expect(field.borderStyle).toBe("solid");
	expect(field.borderColor).not.toBe("rgba(0, 0, 0, 0)");
});

test("onoff buttons switch from ghost to filled when selected", async ({ page }) => {
	await render(
		page,
		`<button id="off" class="onoff">Off</button><button id="on" class="onoff selected">On</button>`,
	);
	const buttons = await page.$$eval("button", (elements) =>
		elements.map((element) => {
			const style = getComputedStyle(element);
			return { backgroundColor: style.backgroundColor, borderColor: style.borderColor };
		}),
	);

	expect(buttons[0].backgroundColor).toMatch(/\/ 0\)$/);
	expect(buttons[0].borderColor).toMatch(/\/ 0\)$/);
	expect(buttons[1].backgroundColor).not.toMatch(/\/ 0\)$/);
	expect(buttons[1].borderColor).not.toMatch(/\/ 0\)$/);
});

test("onoff selected buttons use their semantic accent", async ({ page }) => {
	await render(
		page,
		`<button id="primary" class="onoff primary selected">Primary</button><button id="danger" class="onoff danger selected">Danger</button>`,
	);
	const backgrounds = await page.$$eval("button", (elements) =>
		elements.map((element) => getComputedStyle(element).backgroundColor),
	);

	expect(backgrounds[0]).not.toBe(backgrounds[1]);
});

test("tinted ranges keep the input background transparent", async ({ page }) => {
	await render(page, `<input id="range" class="range primary tinted" type="range" value="50">`);
	const background = await page.$eval("#range", (element) => getComputedStyle(element).backgroundColor);

	expect(background).toMatch(/rgba\(0, 0, 0, 0\)|\/ 0\)$/);
});

test("pagination uses selector-like spacing and current-page fill", async ({ page }) => {
	await render(
		page,
		`<ol class="pagination"><li><a href="#">1</a></li><li><a aria-current="page" href="#">2</a></li><li><a href="#">3</a></li></ol>`,
	);
	const pages = await page.$$eval(".pagination a", (elements) =>
		elements.map((element) => {
			const style = getComputedStyle(element);
			return {
				padding: style.padding,
				borderStyle: style.borderStyle,
				borderLeftWidth: style.borderLeftWidth,
				backgroundColor: style.backgroundColor,
			};
		}),
	);

	expect(pages[0].padding).toBe("8px 16px");
	expect(pages[0].borderStyle).toBe("solid");
	expect(pages[0].borderLeftWidth).toBe("1px");
	expect(pages[1].borderLeftWidth).toBe("0px");
	expect(pages[0].backgroundColor).toMatch(/rgba\(0, 0, 0, 0\)|\/ 0\)$/);
	expect(pages[1].backgroundColor).not.toMatch(/rgba\(0, 0, 0, 0\)|\/ 0\)$/);
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

test("tab background modifiers adjust the shared paint channel", async ({ page }) => {
	await render(
		page,
		`<div class="tabs group"><button id="tab" class="tab primary active bg-2o">Overview</button></div>`,
	);
	const tab = await properties(page, "#tab", [
		"--accent-color",
		"--background-color-base",
		"--background-color-opacity",
	]);
	expect(tab["--accent-color"]).toBe("#0c31bf");
	expect(tab["--background-color-base"]).toBe("#0c31bf");
	expect(tab["--background-color-opacity"]).toBe("0.2");
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

test("border opacity utilities reach control and field edges", async ({ page }) => {
	await render(
		page,
		`<input id="utility" class="input bd-3o">
		<input id="variant" class="input primary bd-3o">
		<input id="field" class="input outline primary" style="--field-border-opacity: 0.2">
		<input id="legacy" class="input" style="--input-border-opacity: 0.4">`,
	);
	const alphas = await page.$$eval("input", (elements) =>
		elements.map((element) => {
			const match = getComputedStyle(element).borderColor.match(/\/\s*([\d.]+)\s*\)/);
			return match ? Number(match[1]) : 1;
		}),
	);
	expect(alphas[0]).toBeCloseTo(0.3, 2);
	expect(alphas[1]).toBeCloseTo(0.3, 2);
	expect(alphas[2]).toBeCloseTo(0.2, 2);
	expect(alphas[3]).toBeCloseTo(0.4, 2);
});
