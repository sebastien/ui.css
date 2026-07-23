import { describe, expect, test } from "bun:test";
import css from "../src/js/uicss.js";
import all from "../src/css/all.js";

const output = [...css(all())].join("\n");

describe("CSS-first components", () => {
	test("styles semantic alerts and native feedback elements", () => {
		expect(output).toContain("[role=alert], .alert");
		expect(output).toContain("progress, meter");
		expect(output).toContain("progress::-webkit-progress-value");
	});

	test("includes native dialog, popover, and switch styling", () => {
		expect(output).toContain("dialog");
		expect(output).toContain("[popover]");
		expect(output).toContain("[popover]:not(:popover-open)");
		expect(output).toContain("menu[popover]:popover-open");
		expect(output).toContain("input[type=checkbox][role=switch]");
	});

	test("includes catalog composition primitives", () => {
		expect(output).toContain(".avatars");
		expect(output).toContain(".table");
		expect(output).toContain(".sidebar-layout");
		expect(output).toContain("[data-tooltip]");
	});

	test("routes pill and badge fills through the background channel", () => {
		expect(output).toContain(".bgc, .pill, .badge {");
		expect(output).toContain("--background-color-base: var(--color-neutral);");
		expect(output).toContain("background-color: var(--background-color);");
		expect(output).toContain("--background-color-blend: 0.1;");
		expect(output).toContain("--background-color-opacity: 0;");
	});
});
