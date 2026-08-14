import { describe, expect, test } from "bun:test";
import css from "../src/js/uicss.js";
import all from "../src/css/all.js";

const output = [...css(all())].join("\n");

describe("lined layout utilities", () => {
	test("uses side-specific border utilities", () => {
		expect(output).toContain(".bdc, .lined {");
		expect(output).toContain("--border-color: color-mix(in oklch");
		expect(output).toContain(".row.lined > * {");
		expect(output).toContain("border-right-width: var(--border-width, 1px);");
		expect(output).toContain("border-right-style: var(--border-style, solid);");
		expect(output).toContain("border-bottom-width: var(--border-width, 1px);");
		expect(output).toContain("border-bottom-style: var(--border-style, solid);");
		expect(output).toContain(".row.lined > *:last-child {");
		expect(output).toContain("border-right-width: 0px;");
	});
});

describe("layout utility behavior", () => {
	test("uses the matching size token for the numeric width scale", () => {
		expect(output).toContain(".w-10 {");
		expect(output).toContain("width: var(--size-10);");
		expect(output).toContain(".h-10 {");
		expect(output).toContain("height: var(--size-10);");
	});

	test("keeps axis-specific sizing and overflow declarations on the requested axis", () => {
		expect(output).toContain(".hmx-1bl {");
		expect(output).toContain("max-height: calc(var(--block-width)*1);");
		expect(output).toContain(".overflow-x {");
		expect(output).toContain("overflow-x: auto;");
		expect(output).toMatch(/\.nooverflow, \.noflow \{[^}]*overflow: clip;/);
	});

	test("maps delta margins to their corresponding axes", () => {
		expect(output).toContain("margin-bottom: var(--dy, 0px);");
		expect(output).toContain("margin-right: var(--dx, 0px);");
	});

	test("keeps position and fit utility declarations valid", () => {
		expect(output).toMatch(/\.to-tr \{[^}]*top: 0px;[^}]*right: 0px;/);
		expect(output).toMatch(/\.to-bl \{[^}]*bottom: 0px;[^}]*left: 0px;/);
		expect(output).toMatch(/\.to-s \{[^}]*bottom: 0%;/);
		expect(output).toMatch(/\.to-e \{[^}]*right: 0%;/);
		expect(output).toMatch(/\.to-w \{[^}]*left: 100%;/);
		expect(output).toMatch(/\.to-wc \{[^}]*top: 50%;/);
		expect(output).toMatch(/\.to-c \{[^}]*top: 50%;[^}]*left: 50%;/);
		expect(output).toContain(".max-fit-w {");
		expect(output).toMatch(/\.max-fit-w \{[^}]*max-width: 100%;/);
		expect(output).toContain(".max-fit-h {");
		expect(output).toMatch(/\.max-fit-h \{[^}]*max-height: 100%;/);
		expect(output).not.toContain("left: %;");
	});

	test("supports responsive grid items with item-only maximum widths", () => {
		expect(output).toContain(".grid-items {");
		expect(output).toContain(
			"grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--item-min, 16rem)), 1fr));",
		);
		expect(output).toContain(".grid-items > * {");
		expect(output).toContain("max-width: var(--item-max, none);");
	});
});

describe("style utility behavior", () => {
	test("uses the border token and depth scale for tactile effects", () => {
		expect(output).toContain(".d {");
		expect(output).toContain("--depth: 0.25px;");
		expect(output).toContain(".d-4 {");
		expect(output).toContain("--depth: 1px;");
		expect(output).toContain("border-width: var(--border-width);");
		expect(output).toContain(".outset, .raised");
		expect(output).toContain(".t-inset");
		expect(output).toContain("text-shadow: calc(var(--depth, 1px) * -1)");
	});

	test("background dimming controls the background color opacity channel", () => {
		expect(output).toContain(".bg-dim {");
		expect(output).toContain("--background-color-opacity: 0.6;");
	});

	test("supports the table collapse utility", () => {
		expect(output).toContain("table.collapse {");
		expect(output).toContain("border-collapse: collapse;");
	});
});
