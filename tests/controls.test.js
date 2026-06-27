import { describe, expect, test } from "bun:test";
import css from "../src/js/uicss.js";
import all from "../src/css/all.js";

const output = [...css(all())].join("\n");

// Count occurrences of a substring in the rendered stylesheet.
const count = (needle) => output.split(needle).length - 1;

describe("controls color model", () => {
	// The accent pin: backgrounds that must track the semantic color set
	// --control-background-base: var(--control-color-base) on the element itself,
	// so an inherited --control-background-base can never defeat color variants.
	const ACCENT_PIN = "--control-background-base: var(--control-color-base)";

	test("actions include button-type inputs", () => {
		expect(output).toContain(
			"button, .button, input[type=submit], input[type=button], input[type=reset]",
		);
	});

	test("field element selector excludes button-likes and .button", () => {
		// :where() keeps element-level specificity so per-component rules win
		expect(output).toContain(
			"input:where(:not([type=submit],[type=button],[type=reset],[type=image]):not(.button))",
		);
	});

	test("action pins background-base to the accent", () => {
		// action base, checkbox checked + indeterminate, radio checked,
		// toggle checked, selector checked label.
		// Tab no longer uses action() — it has its own standalone style.
		expect(count(ACCENT_PIN)).toBe(6);
	});

	test("field surface is mode-aware via --color-page", () => {
		expect(output).toContain(
			"--control-background-base: var(--color-page, var(--color-paper))",
		);
	});

	test("backgrounds are painted from the background channel only", () => {
		// Ghost states now drive --control-background-opacity…
		expect(output).toContain("--control-background-opacity: 0.25");
		expect(output).toContain("--control-background-opacity: 0.35");
		// …and the old fallback-less color-channel ghost painting is gone
		expect(output).not.toContain(
			"color-mix(in oklch, var(--control-color-base), var(--control-color-tint)",
		);
	});

	test("--control-border-size is unified into --control-border-width", () => {
		expect(output).not.toContain("--control-border-size");
		expect(output).toContain("--control-border-width: 1px");
	});
});
