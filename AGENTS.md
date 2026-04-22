# AGENTS.md - ui.css Repository Guide

This file is for coding agents working in `ui.css`.
It documents build, lint, and test commands plus the code conventions already in use.

## Scope
- Repository root: `ui.css`
- Primary language: JavaScript ES modules
- Build system: LittleSDK via `make`
- Main artifact: generated CSS, especially `dist/ui.css`
- Runtime/tooling: Bun, Biome, mise, shell scripts

## Rule Files
- Follow this file plus inherited SDK guidance in `deps/sdk/AGENTS.md`
- OpenCode rules exist in `.opencode/rules/` and are loaded by `opencode.jsonc`
- Cursor rules: none found in `.cursor/rules/`
- `.cursorrules`: not present
- Copilot instructions: none found in `.github/copilot-instructions.md`

## Repository Layout
- `src/js/` - core CSS DSL and generation engine
- `src/css/` - utility and component style modules
- `src/html/` - scratch HTML assets
- `src/mk/` - repository-specific Make config and rules
- `bin/uicss` - CLI entrypoint that renders CSS with Bun
- `dist/` - generated outputs
- `deps/sdk/` - LittleSDK bootstrap and shared rules

## Build And Discovery Commands
- `make` - shows help; default target is not a build
- `make help` - list phases and rules
- `make help-vars` - inspect SDK variables and defaults
- `make prep` - materialize SDK-managed dotfiles and tool setup
- `make shell` - open a shell with the repo environment configured
- `make build` - run SDK build phase; mainly prepares JS build artifacts
- `make dist` - generate distribution outputs, including `dist/ui.css`
- `make dist/ui.css` - build only the main stylesheet
- `./bin/uicss > dist/ui.css` - direct stylesheet generation without make
- `./bin/uicss src/css/colors.js` - render a single CSS module
- `./bin/uicss src/css/colors.js src/css/layout.js` - render multiple modules as layers
- `./bin/uicss --doc src/css/colors.js` - emit module docs as JSON

## Lint, Format, And Typecheck Commands
- `make check` - main lint/check entrypoint; currently runs JS linting via Biome and enabled SDK checks
- `make lint` - alias for `make check`
- `make js-check` - run JavaScript and TypeScript checks directly
- `make fix` - apply automatic fixes through SDK-enabled fixers
- `make fmt` - alias for `make fix`
- `make js-fix` - run Biome with `--fix` for JS/TS sources
- `make js-typecheck` - typecheck TypeScript only if a `tsconfig.json` exists

## Test Commands
- `make test` - main test entrypoint
- `make js-test` - run JavaScript and TypeScript tests through `bun test`
- `make py-test` - run Python tests if any exist
- There is currently no `tests/` directory and no `*.test.js` / `*.test.ts` files
- Because of that, `make test` currently succeeds without running repository tests

## Running A Single Test
- Preferred single JS test: `make js-test TESTS_JS=tests/name.test.js`
- Preferred single TS test: `make js-test TESTS_TS=tests/name.test.ts`
- Broad single-entry form: `make test TESTS_JS=tests/name.test.js`
- Direct Bun fallback: `bun test tests/name.test.js`
- New tests should live under `tests/` and follow `*.test.js`, `*.test.ts`, `*.test.py`, or `*.test.sh`

## Runtime And Deployment Notes
- `make run` is overridden by `src/mk/rules.mk` and is effectively a no-op
- `make www-build`, `make www-dist`, `make www-bundle`, and `make www-bundle-debug` come from the SDK
- `make cloudflare-start-wrangler` and `make cloudflare-deploy-pages` exist if Cloudflare workflow is used
- `package.json` is minimal and does not define scripts; prefer `make` targets over `npm run`
- `wrangler` is installed but not part of the main CSS generation path

## Formatting Rules
- Use tabs in JavaScript, shell, Python, and CSS files
- Use 4-space tab width in JS, shell, Python, and CSS
- Use 2-space indentation in Markdown, HTML, and XML where configured
- Follow `.prettierrc`: no semicolons, double quotes, trailing commas where valid, `printWidth` 120, `arrowParens: always`
- `biome.jsonc` customizes linter behavior; formatting rules mainly come from `.editorconfig` and `.prettierrc`
- Preserve existing banner separators like `// ----------------------------------------------------------------------------`
- Keep code compact; this repo prefers dense but readable declarations

## Import And Module Style
- Use ES modules only: `import` / `export`
- Prefer relative imports with explicit `.js` extensions
- Keep imports at the top of the file
- Group imported names in a stable, readable order
- Default exports are common for top-level CSS modules
- Shared helpers from `src/js/uicss.js` are frequently imported as named exports

## File Structure Conventions
- Typical order: imports, local constants/helpers, main declarations, exports at the end
- Large files often use banner comments to separate major sections
- CSS modules usually export a single `named(...)`, `group(...)`, `layer(...)`, or function composition
- `src/js/uicss.js` is the main source of internal DSL conventions

## Naming Conventions
- Classes use PascalCase, for example `Scope`, `Rule`, `Group`
- Concise helper functions use lowercase names like `rule`, `group`, `mods`, `times`, `blend`
- Longer helpers may use camelCase, for example `colorvars`
- Exported vocabularies often use uppercase names like `COLORS`, `SEMANTIC`, `SIZES`, `STATES`
- Internal lookup tables may stay lowercase, for example `sizes`, `sides`, `percentages`
- CSS property keys and custom-property source keys often use snake_case that later becomes kebab-case

## Types And Data Shapes
- This is plain JavaScript; do not introduce TypeScript syntax into JS files
- Functions often accept flexible shapes: strings, arrays, plain objects, custom classes, and generator-friendly values
- Plain objects are used for structured CSS property maps and grouped rules
- The code frequently checks `Object.getPrototypeOf(value) === Object.prototype` to distinguish plain objects from instances
- Generators are a core pattern for emitting CSS lines, rules, and docs; keep generator APIs as `function*`

## CSS DSL Conventions
- Prefer composing output with `rule(...)`, `group(...)`, `named(...)`, `layer(...)`, and `layers(...)`
- Property objects commonly use underscore-separated keys such as `font_size` or `justify_content`
- The engine converts those keys to kebab-case CSS output
- Repetitive utility generation usually uses arrays plus `.map(...)` or `times(...)`
- Spread syntax is common for merging repeated rule lists into a `group(...)`
- Selector sets are often built with helpers such as `mods(...)`, `cross(...)`, and `classes(...)`

## Error Handling And Diagnostics
- Throw `Error` for unsupported input shapes that should stop execution
- Use `console.warn(...)` for recoverable or diagnostic conditions
- Do not silently swallow invalid states that would corrupt generated CSS
- Keep CLI failures terse and readable; `bin/uicss` prints `!!! ERR ...` on doc-generation failure

## Comments And Documentation
- Prefer concise comments that explain intent, not obvious syntax
- Keep existing banner comment style when editing files that already use it
- `TODO` and `FIXME` comments already exist and are acceptable for known gaps
- Avoid noisy comments in straightforward utility generation code
- NaturalDocs-style compact documentation fits this codebase well

## Shell And CLI Style
- Shell scripts use `bash`
- Match the existing Bash style in `bin/uicss`
- Keep CLI output terse and friendly to pipes
- Resolve repository-relative paths the way `bin/uicss` does instead of assuming the caller's cwd

## Agent Workflow Expectations
- Prefer `make` targets over ad hoc commands when both exist
- After source edits in `src/js/` or `src/css/`, run at least `make check`
- If you add tests, run the narrowest relevant command first, then broader suites if needed
- Do not assume `make run` exercises the app; it does not in this repo
- Do not invent npm scripts unless the user explicitly requests that workflow

## Known Repository Quirks
- `make check` may report existing warnings; treat them as baseline unless your change affects them
- `make test` currently reports success even though no repository tests exist yet
- The root `README.md` is minimal and not a reliable workflow reference
- Some SDK-managed dotfiles appear only after `make prep` or another make invocation

## Practical Defaults For Agents
- For the shipped stylesheet, use `make dist/ui.css`
- For JS/CSS validation, use `make check`
- For automatic fixes, use `make fmt`
- For one-off CSS inspection, use `./bin/uicss`
- For new tests, put them in `tests/` and run them with `make js-test TESTS_JS=...`
