import { describe, expect, test } from "bun:test";
import css from "../src/js/uicss.js";
import all from "../src/css/all.js";

const output = [...css(all())].join("\n");

describe("CSS-first components", () => {
	test("styles explicit alert classes and native feedback elements", () => {
		expect(output).toContain(".alert {");
		expect(output).not.toContain("[role=alert]");
		expect(output).toContain("animation: loading-spinner 720ms linear infinite;");
		expect(output).toContain("translate(-50%, -50%) rotate(360deg)");
		expect(output).toContain("progress, meter");
		expect(output).toContain("progress::-webkit-progress-value");
		expect(output).toContain("meter::-webkit-meter-optimum-value");
		expect(output).toContain("progress.success::-webkit-progress-value");
		expect(output).toContain("meter.success::-webkit-meter-optimum-value");
		expect(output).toContain("progress.tinted.success::-webkit-progress-value");
		expect(output).toContain("meter.tinted.danger::-webkit-meter-optimum-value");
		expect(output).toContain(".pagination");
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
		expect(output).toContain("[data-tooltip]");
		expect(output).toContain(".buttons");
		expect(output).toContain("gap: 1px;");
		expect(output).toContain(".buttons.outline");
		expect(output).toContain(".toast");
		expect(output).not.toContain(".sidebar-layout");
		expect(output).not.toContain("min-width: 32rem");
		expect(output).not.toContain(".table {");
});

	test("routes pill and badge fills through the background channel", () => {
		expect(output).toContain(".bgc, .pill, .badge {");
		expect(output).toContain("--background-color-base: var(--color-neutral);");
		expect(output).toContain("background-color: var(--background-color);");
		expect(output).toContain("--background-color-blend: 0.1;");
		expect(output).toContain("--background-color-opacity: 0;");
	});

	test("interactive menu items expose a compact padding variant", () => {
		expect(output).toContain(
			"menu[popover]:popover-open :is(a, button, [role=menuitem]).compact",
		);
		expect(output).toContain("padding: 0.35rem 0.5rem;");
	});
});
