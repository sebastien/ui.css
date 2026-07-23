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

	test("checked and tinted pins background-base to the accent", () => {
		// checkbox checked + indeterminate, radio checked, toggle checked,
		// selector checked label (5), plus .tinted on each field() emission
		// (fields group, checkbox, radio, toggle, range, select, selector = 7)
		// → 12. Default actions use --color-neutral-background instead.
		// Tab no longer uses action() — it has its own standalone style.
		expect(count(ACCENT_PIN)).toBe(12);
	});

	test("default action fill uses light neutral background", () => {
		expect(output).toContain(
			"--control-background-base: var(--color-neutral-background, var(--color-neutral))",
		);
	});

	test("field surface is neutral paper at 0.8 opacity", () => {
		expect(output).toContain("--control-background-base: var(--color-paper)");
		expect(output).toContain("--control-background-opacity: 0.8");
	});

	test("field .tinted washes the main accent via opacity only", () => {
		expect(output).toContain("&.tinted");
		expect(output).toContain(
			"--control-background-base: var(--control-color-base)",
		);
		expect(output).toContain("--control-background-blend: 1");
		expect(output).toContain("--control-background-opacity: 0.15");
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
