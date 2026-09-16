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

	test("border inherit is available for controls and checkbox variants", () => {
		expect(output).toContain(".bd-i {");
		expect(output).toContain("border-color: inherit;");
		expect(output).toContain("input[type=checkbox]:not(.toggle):not(.selector):not([role=switch]), .checkbox");
	});

	test("unchecked checkboxes have a visible border", () => {
		expect(output).toContain("border-width: var(--checkbox-border-width, 1px);");
	});

	test("group prefixes share field styling", () => {
		expect(output).toContain(".group > :not(input, textarea, select, button, .input, .textarea, .select, .button)");
	});

	test("file inputs join a selector button to the field", () => {
		expect(output).toContain("input[type=file], .file {");
		expect(output).toContain("&::file-selector-button {");
		expect(output).toContain(
			"--file-background: var(--color-neutral-background, var(--color-neutral));",
		);
		expect(output).toContain("background-color: var(--file-background);");
		expect(output).toContain("color: contrast-color(var(--file-background));");
		expect(output).toContain("&:hover::file-selector-button {");
		expect(output).toContain(
			"--file-background: var(--color-primary-background, var(--color-primary));",
		);
		// .file is a first-class field alias, so .input.file works on any element.
		expect(output).toContain(
			".select, .file, .group > :not(input, textarea, select, button, .input, .textarea, .select, .button)",
		);
	});

	test("tabs have classic, grouped, outline, and bar presentations", () => {
		expect(output).toContain(".tabs .tab");
		expect(output).toContain(".tabs:not(.group):not(.outline):not(.bar) .tab[aria-selected=true]");
		expect(output).toContain(".tabs.group");
		expect(output).toContain(".tabs.outline");
		expect(output).toContain(".tabs.bar");
		expect(output).toContain(".tabs:not(.group):not(.outline):not(.bar).primary .tab");
		expect(output).toContain(".tabs.outline.primary .tab");
		expect(output).toContain("color: var(--color-ink);");
		expect(output).toContain("border: 0;");
		expect(output).toContain("border-radius: 0.375rem 0.375rem 0 0;");
		expect(output).toContain("padding: 0.35rem;");
		expect(output).toContain("flex-wrap: wrap;");
		expect(output).toContain("--accent-color: var(--color-primary);");
	});

	test(".tabs.wrap wraps any tab presentation", () => {
		const tabs = output.slice(
			output.indexOf("/* @group tab */"),
			output.indexOf("/* @end tab */"),
		);
		expect(tabs).toContain(".tabs.wrap {");
	});

	test("tabs paint through the background color channel", () => {
		const tabs = output.slice(output.indexOf("/* @group tab */"));
		expect(tabs).toContain("--background-color-base: var(--color-neutral);");
		expect(tabs).toContain("--background-color-opacity: 0.2;");
		expect(tabs).toContain("--background-color-opacity: 0;");
		expect(tabs).toContain("--background-color-opacity: 1;");
		expect(tabs).toContain("--background-color-base: var(--accent-color, var(--color-surface));");
		expect(tabs).toContain("background-color: var(--background-color);");
		expect(tabs).toContain("contrast-color(var(--background-color))");
		expect(tabs).toContain("--control-color-base: var(--color-primary);");
		expect(tabs).toContain("--background-color-base: var(--color-primary);");
	});

	test("outline tabs use a border rule and state colors", () => {
		const tabs = output.slice(output.indexOf("/* @group tab */"));
		expect(tabs).toContain(".tabs.outline");
		expect(tabs).toContain(
			"border-bottom: var(--border-width) solid color-mix(in oklch, color-mix(in oklch, var(--border-color-base)");
		expect(tabs).toContain("border: 0;");
		expect(tabs).toContain(".tabs.outline.top");
		expect(tabs).toContain(".tabs.outline.bottom");
		expect(tabs).toContain(".tabs.outline .tab[aria-selected=true], .tabs.outline .tab.active");
		expect(tabs).toContain("color: var(--color-ink);");
		expect(tabs).toContain(".tabs.outline .tab::after");
		expect(tabs).toContain("height: var(--border-width);");
		expect(tabs).toContain("border-radius: 0;");
		expect(tabs).toContain("margin-bottom: calc(-1 * var(--border-width));");
		expect(tabs).toContain("visibility: visible;");
		expect(tabs).toContain(".tabs.outline .tab:hover");
		expect(tabs).toContain("background-color: transparent;");
		expect(tabs).toContain(".tabs.outline .tab:not([aria-selected=true]):not(.active):hover");
		expect(tabs).toContain(".tabs.vertical");
		expect(tabs).toContain(".tabs.outline.vertical");
		expect(tabs).toContain("border-right: var(--border-width) solid color-mix(in oklch, color-mix(in oklch, var(--border-color-base)");
		expect(tabs).toContain(".tabs.outline.vertical .tab::after");
		expect(tabs).toContain(".tabs.outline.vertical.left");
		expect(tabs).toContain("border-left: var(--border-width) solid color-mix(in oklch, color-mix(in oklch, var(--border-color-base)");
		expect(tabs).toContain(".tabs.outline.vertical.left .tab::after");
		expect(tabs).toContain(".tabs.outline.vertical.right");
	});

	test("bar tabs are a joined selector-like bar with a filled active tab", () => {
		const tabs = output.slice(output.indexOf("/* @group tab */"));
		expect(tabs).toContain(".tabs.bar {");
		expect(tabs).toContain("width: fit-content;");
		expect(tabs).toContain("border-radius: 0.375rem;");
		expect(tabs).toContain(".tabs.bar .tab {");
		expect(tabs).toContain(".tabs.bar .tab:first-child {");
		expect(tabs).toContain("border-left: 0;");
		expect(tabs).toContain(".tabs.bar .tab[aria-selected=true], .tabs.bar .tab.active {");
		expect(tabs).toContain("color: contrast-color(var(--background-color));");
		expect(tabs).toContain(".tabs.bar.primary {");
		expect(tabs).toContain("--accent-color: var(--color-primary);");
	});

	test("selected tabs paint the channel background directly", () => {
		const tabs = output.slice(output.indexOf("/* @group tab */"));
		expect(tabs).toContain(
			".tabs .tab[aria-selected=true], .tabs .tab.active {\n\t\tbackground-color: var(--background-color);",
		);
	});

	test("tabs and selectors support disabled items", () => {
		expect(output).toContain(".tabs .tab:disabled, .tabs .tab.disabled {");
		expect(output).toContain("cursor: not-allowed;");
		expect(output).toContain("& > input:disabled + label, & > label.disabled {");
		expect(output).toContain("&.disabled > label {");
		expect(output).toContain(
			".selector.toggle.disabled > button, .selector.toggle > button:disabled, .selector.toggle > button.disabled {",
		);
	});

	test("interactive controls expose compact padding variants", () => {
		expect(output).toContain("&.compact > option");
		expect(output).toContain(".tabs.compact");
		expect(output).toContain(".tabs.compact .tab, .tabs .tab.compact");
		expect(output).toContain("padding: 0.35em 0.5em;");
		expect(output).toContain(".tabs.compacted");
		expect(output).toContain(".tabs.compacted .tab");
		expect(output).toContain("flex: 0 0 min-content;");
	});

	test("field element selector excludes button-likes and .button", () => {
		// :where() keeps element-level specificity so per-component rules win
		expect(output).toContain(
			"input:where(:not([type=submit],[type=button],[type=reset],[type=image]):not(.button))",
		);
		expect(output).toContain(":where(.selector)");
	});

	test(".selector is not in the shared fields group", () => {
		expect(output).toContain(
			".input, input:where(:not([type=submit],[type=button],[type=reset],[type=image]):not(.button)), textarea, .textarea, select, .select, .group > :not(input, textarea, select, button, .input, .textarea, .select, .button)",
		);
		expect(output).not.toContain(", .selector, .group > :not(input, textarea, select, button, .input, .textarea, .select, .button)",
		);
	});

	test("checked and tinted pins background-base to the accent", () => {
		// checkbox checked + indeterminate, radio checked, toggle checked,
		// selector checked label (5), plus .tinted on each field() emission
		// tinted selector labels (1), and selected/tinted native option rows (2)
		// (fieldstates emits .tinted once)
		// → 11. Default actions use --color-neutral-background instead.
		// Tab no longer uses action() — it has its own standalone style.
		expect(count(ACCENT_PIN)).toBe(11);
	});

	test("default action fill uses light neutral background", () => {
		expect(output).toContain(
			"--control-background-base: var(--color-neutral-background, var(--color-neutral))",
		);
	});

	test("actions reset inherited selectable opacity", () => {
		const actions = output.slice(output.indexOf("/* @group actions */"));
		expect(actions).toContain("--control-color-opacity: 1");
		expect(actions).toContain("--control-background-opacity: 1");
	});

	test("selectable hover uses the neutral background", () => {
		const selectable = output.slice(output.indexOf("/* @group selectable */"));
		const hover = selectable.slice(selectable.indexOf("&:hover, &.hover"));
		expect(hover).toContain(
			"--control-background-base: var(--color-neutral-background, var(--color-neutral))",
		);
	});

	test("field surface follows the mode-aware surface role at 0.8 opacity", () => {
		expect(output).toContain("--control-background-base: var(--color-surface)");
		expect(output).toContain("--control-background-opacity: 0.8");
	});

	test("fields follow the interactive control border, with an optional field override", () => {
		const fields = output.slice(
			output.indexOf("/* @group fieldbase */"),
			output.indexOf("/* @end fieldbase */"),
		);
		expect(fields).toContain(
			"--field-border-base, var(--border-base, var(--control-border-base))",
		);
		expect(fields).toContain(
			"--field-border-opacity, var(--border-opacity, var(--control-border-opacity, 0.75))",
		);
		expect(fields).not.toContain("--control-border-base: var(--border-color-base)");
		expect(fields).toContain("--control-outline-base: var(--control-color-base)");
		expect(fields).toContain("--control-outline-tint: var(--control-color-base)");
		expect(fields).toContain("--control-outline-blend: 1");
	});

	test("multiple selects preserve native listbox appearance", () => {
		const select = output.slice(output.indexOf("/* @group select */"));
		expect(select).toContain("&:not([multiple]):not(.vertical)");
		expect(select).toContain("&[multiple], &.vertical");
		expect(select).toContain("appearance: auto");
	});

	test("vertical select options use selector-like rows", () => {
		const select = output.slice(output.indexOf("/* @group select */"));
		expect(select).toContain("&[multiple] > option, &.vertical > option");
		expect(select).toContain("width: 100%");
		expect(select).toContain("font-weight: inherit");
		expect(select).toContain("padding: 0.5em 1em");
		expect(select).toContain("text-align: left");
		expect(select).toContain("cursor: pointer");
		expect(select).toContain("scrollbar-width: none");
		expect(select).toContain("&[multiple]::-webkit-scrollbar, &.vertical::-webkit-scrollbar");
		expect(select).toContain("&[multiple] > option:checked, &.vertical > option:checked");
		expect(select).toContain("&[multiple] > option.danger, &.vertical > option.danger");
	});

	test("field .tinted washes the main accent via opacity only", () => {
		expect(output).toContain("&.tinted");
		expect(output).toContain(
			"--control-background-base: var(--control-color-base)",
		);
		expect(output).toContain("--control-background-blend: 1");
		expect(output).toContain("--control-background-opacity: 0.15");
	});

	test("text fields support transparent outline variants", () => {
		expect(output).toContain(".input.outline");
		expect(output).toContain("background-color: transparent;");
		expect(output).toContain("--control-border-opacity: 1;");
	});

	test("onoff actions are ghost by default and filled when selected", () => {
		expect(output).toContain("&.onoff");
		expect(output).toContain("&.selected");
		expect(output).toContain("--control-background-opacity: 0;");
		expect(output).toContain("--control-background-opacity: 1;");
	});

	test("actions pin their background blend against inherited field variants", () => {
		const actions = output.slice(output.indexOf("/* @group actions */"));
		expect(actions).toContain("--control-background-blend: 1;");
	});

	test("range tracks expose tinted progress styling", () => {
		expect(output).toContain("::-webkit-slider-runnable-track");
		expect(output).toContain(".tinted::-webkit-slider-runnable-track");
		expect(output).toContain("--range-progress");
		expect(output).toContain("::-moz-range-progress");
		expect(output).not.toContain("accent-color: var(--control-color-base);");
		expect(output).toContain("background-color: var(--color-paper);");
		expect(output).toContain("background-color: transparent !important;");
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

	test("colored ghost fields have a visible background", () => {
		expect(output).toContain(".input.ghost.white");
		expect(output).toContain(".input.ghost.error");
		expect(output).toContain(
		"--control-background-base: var(--color-error-background, var(--color-error));",
	);
		expect(output).toContain("--control-background-blend: 1;");
		expect(output).toContain("--control-background-opacity: 1;");
	});

	test("success uses the generated green color token", () => {
		expect(output).toContain("--color-success: var(--color-green);");
		expect(output).not.toContain("--color-success: var(--colog-green);");
	});

	test("generic color utilities paint controls from the later colors layer", () => {
		expect(output).toContain(".bg-primary {");
		expect(output).toContain(".bg {");
		expect(output).toContain("background-color: var(--background-color);");
		expect(output).toContain(".bd {");
		expect(output).toContain(".ol {");
	});

	test("switches expose optional shadow and outline variants", () => {
		expect(output).toContain("&.shadow::before");
		expect(output).toContain("&.outline:checked, &.outline.checked");
		expect(output).toContain("background-color: transparent;");
	});

	test("color reset wrappers clear inherited recipes", () => {
		expect(output).toContain(":where(.reset-bg > *) {");
		expect(output).toContain(":where(.reset-txt > *) {");
		expect(output).toContain(":where(.reset-bd > *) {");
		expect(output).toContain(":where(.reset-ol > *) {");
		expect(output).toContain("border-width: 0px;");
		expect(output).toContain("outline-width: 0px;");
	});

	test("default color utilities follow page roles in dark mode", () => {
		expect(output).toContain(".bg-def {");
		expect(output).toContain("background-color: var(--color-page);");
		expect(output).toContain(".tx-def {");
		expect(output).toContain("color: var(--color-text);");
		expect(output).toContain("--color-surface: var(--color-ink);");
		expect(output).toContain("--color-surface-text: var(--color-paper);");
	});

	test("control semantic variants publish the shared accent role", () => {
		expect(output).toContain("--control-color-base: var(--accent-color");
		expect(output).toContain("--accent-color: var(--color-primary);");
	});

	test("shared chrome and color variants are emitted once", () => {
		expect(count("font-family: var(--control-font-family, var(--font-controls-family));")).toBe(1);
		expect(count("/* @group fieldbase */")).toBe(1);
		expect(count("/* @group colorvariants */")).toBe(1);
	});

	test("selector items support semantic colors in their states", () => {
		expect(output).toContain("& > label.danger");
		expect(output).toContain("& > label.error");
		expect(output).toContain("&.white > label");
		expect(output).toContain("&.tinted > label");
		expect(output).toContain("& > label:active, & > label.active");
	});

	test("selectors support horizontal and vertical joined layouts", () => {
		const selector = output.slice(output.indexOf("/* @group selector */"));
		expect(selector).toContain(".selector {");
		expect(selector).toContain("--control-gap: 0em");
		expect(selector).toContain("gap: 0em");
		expect(selector).toContain("border: 0;");
		expect(selector).toContain("background: transparent;");
		expect(selector).toContain("box-shadow: none;");
		expect(selector).toContain("&.tinted");
		expect(selector).toContain("&.horizontal");
		expect(selector).toContain("flex-direction: row");
		expect(selector).toContain("&.vertical > label");
		expect(selector).toContain("flex-direction: column");
		expect(selector).toContain("border-top-width: 0px");
		expect(selector).toContain("&.stretch:not(.vertical) > label");
	});

	test("squared selectors remove label corner rounding", () => {
		const selector = output.slice(output.indexOf("/* @group selector */"));
		expect(selector).toContain(".selector.squared > input, .selector.squared > label");
		expect(selector).toContain("border-radius: 0em;");
	});

	test("selector toggle is a segmented group matching switch chrome", () => {
		const selector = output.slice(output.indexOf("/* @group selector */"));
		expect(selector).toContain(".selector.toggle {");
		expect(selector).toContain(".selector.toggle.rounded {");
		expect(selector).toContain(".selector.toggle.outline {");
		expect(selector).toContain(".selector.toggle.shadow > button[aria-pressed=true]");
		expect(selector).toContain(".selector.toggle > button {");
		expect(selector).toContain(
			".selector.toggle > button[aria-pressed=true], .selector.toggle > button.selected {",
		);
		expect(output).toContain(".toggle:not(.selector)");
		expect(output).not.toContain(".selector.toggle::before");
	});

	test("--control-border-size is unified into --control-border-width", () => {
		expect(output).not.toContain("--control-border-size");
		expect(output).toContain("--control-border-width: 1px");
	});

	test("controls apply shared font size and border radius tokens", () => {
		expect(output).toContain(
			"font-size: var(--control-font-size, 1em);",
		);
		expect(output).toContain(
			"border-radius: var(--control-border-radius, 0.25em);",
		);
	});

	test("fields and actions expose per-kind font size and radius overrides", () => {
		const fields = output.slice(output.indexOf("/* @group fieldbase */"));
		const actions = output.slice(
			output.indexOf("/* @group actions */"),
			output.indexOf("/* @end actions */"),
		);

		expect(fields).toContain(
			"font-size: var(--field-font-size, var(--control-font-size, 1em));",
		);
		expect(fields).toContain(
			"border-radius: var(--field-border-radius, var(--control-border-radius, 0.25em));",
		);
		expect(actions).toContain(
			"font-size: var(--action-font-size, var(--control-font-size, 1em));",
		);
		expect(actions).toContain(
			"border-radius: var(--action-border-radius, var(--control-border-radius, 0.25em));",
		);
	});
});
