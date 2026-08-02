import { defineConfig } from "@playwright/test";

export default defineConfig({
	testDir: "./tests/browser",
	outputDir: "/tmp/opencode/ui.css-playwright",
	forbidOnly: !!process.env.CI,
	projects: [{ name: "chromium", use: { browserName: "chromium" } }],
});
