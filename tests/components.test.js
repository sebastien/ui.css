import { describe, expect, test } from "bun:test";
import css from "../src/js/uicss.js";
import all from "../src/css/all.js";
import { SEMANTIC } from "../src/css/colors.js";

const output = [...css(all())].join("\n");

describe("CSS-first components", () => {
	test("exports semantic color names as an ordered vocabulary", () => {
		expect(SEMANTIC).toEqual([
			"paper",
			"ink",
			"neutral",
			"primary",
			"secondary",
			"tertiary",
			"success",
			"info",
			"warning",
			"danger",
			"error",
			"accent",
		]);
	});
	test("styles explicit alert classes and native feedback elements", () => {
		expect(output).toContain(".alert {");
		expect(output).toContain(".alert.outline");
		expect(output).toContain(".alert.outline.success");
		expect(output).toContain("--accent: var(--color-success);");
		expect(output).toContain(
			":where(.alert.outline) :where(input, textarea, select, .input, .textarea, .select):not(.colored)",
		);
		expect(output).toContain("background-color: transparent;");
		expect(output).not.toContain("[role=alert]");
		expect(output).toContain("animation: loading-spinner 720ms linear infinite;");
		expect(output).toContain("translate(-50%, -50%) rotate(360deg)");
		expect(output).toContain("progress, meter");
		expect(output).toContain("progress::-webkit-progress-value");
		expect(output).toContain("meter::-webkit-meter-optimum-value");
		expect(output).toContain("progress.success, meter.success");
		expect(output).not.toContain("progress.tinted.success");
		expect(output).toContain("--meter-color: var(--color-success);");
		expect(output).toContain("background: var(--meter-color, var(--color-neutral)) !important;");
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
		expect(output).toContain(".pagination > * > :is(a, .button)");
		expect(output).toContain("padding: 0.5em 1em;");
		expect(output).toContain("border-style: solid;");
		expect(output).toContain(".toast");
		expect(output).not.toContain(".sidebar-layout");
		expect(output).not.toContain("min-width: 32rem");
		expect(output).not.toContain(".table {");
});

	test("clips panel tracks without creating a scroll container", () => {
		expect(output).toMatch(/\.panels \{[^}]*overflow: clip;/);
		expect(output).toMatch(/\.panels > \.horizontal > \* \{[^}]*overflow: auto;/);
		expect(output).toMatch(/\.panels > \.vertical > \* \{[^}]*overflow: auto;/);
	});

	test("includes a resizable divider with an optional handle", () => {
		expect(output).toContain(".divider {");
		expect(output).toContain("cursor: col-resize;");
		expect(output).toContain(".divider > .handle {");
		expect(output).toContain(".divider.horizontal, .divider[aria-orientation=horizontal] {");
		expect(output).toContain("cursor: row-resize;");
	});

	test("uses clip for non-scrollable visual and animated overflow", () => {
		expect(output).toMatch(/\.avatar, figure\[data-avatar\] \{[^}]*overflow: clip;/);
		expect(output).toMatch(/progress, meter \{[^}]*overflow: clip;/);
		expect(output).toMatch(/\.shimmer \{[^}]*overflow: clip;/);
		expect(output).toMatch(/\.progress-indeterminate \{[^}]*overflow: clip;/);
		expect(output).toMatch(/\.accordion > :not\(summary\) \{[^}]*overflow: clip;/);
	});

	test("keeps legacy figure avatar markup styled", () => {
		expect(output).toContain("figure[data-avatar]");
		expect(output).toContain(".avatars > :is(.avatar, figure[data-avatar])");
	});

	test("routes pill and badge fills through the background channel", () => {
		expect(output).toContain(".bgc, .pill, .badge {");
		expect(output).toContain("--background-color-base: var(--color-neutral);");
		expect(output).toContain("background-color: var(--background-color);");
		expect(output).toContain("--background-color-blend: 0.1;");
		expect(output).toContain("--background-color-opacity: 0;");
	});

	test("uses the shared accent role for component identities", () => {
		expect(output).toContain("--accent: var(--color-neutral);");
		expect(output).toContain("&.soft");
		expect(output).not.toContain(".pill.secondary {");
		expect(output).not.toContain("--pill-color");
		expect(output).not.toContain("--pagination-color");
	});

	test("routes card variants through shared paint channels", () => {
		expect(output).toContain("--background-color-base: var(--color-primary);");
		expect(output).toContain("--border-color-base: var(--color-primary);");
		expect(output).toContain("background-color: var(--background-color);");
		expect(output).toContain("border-color: var(--border-color);");
	});

	test("interactive menu items expose a compact padding variant", () => {
		expect(output).toContain(
			"menu[popover]:popover-open :is(a, button, [role=menuitem]).compact",
		);
		expect(output).toContain("padding: 0.35rem 0.5rem;");
	});

	test("styles attachments with media, content, actions, and states", () => {
		expect(output).toContain(".attachment {");
		expect(output).toContain(".attachment .media {");
		expect(output).toContain(".attachment .media > img {");
		expect(output).toContain(".attachment .title {");
		expect(output).toContain(".attachment .description {");
		expect(output).toContain(".attachment .actions {");
		expect(output).toContain(".attachment .trigger {");
		expect(output).toContain(".attachment[data-state=error] {");
		expect(output).toContain(".attachment[data-state=idle] {");
		expect(output).toContain(".attachment.small {");
		expect(output).toContain(".attachment.smaller {");
		expect(output).toContain(".attachment.vertical {");
		expect(output).toContain("@keyframes attachment-pulse");
	});
});
