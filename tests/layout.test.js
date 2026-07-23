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
	});

	test("maps delta margins to their corresponding axes", () => {
		expect(output).toContain("margin-bottom: var(--dy, 0px);");
		expect(output).toContain("margin-right: var(--dx, 0px);");
	});
});

describe("style utility behavior", () => {
	test("background dimming controls the background color opacity channel", () => {
		expect(output).toContain(".bg-dim {");
		expect(output).toContain("--background-color-opacity: 0.6;");
	});

	test("supports the table collapse utility", () => {
		expect(output).toContain("table.collapse {");
		expect(output).toContain("border-collapse: collapse;");
	});
});
