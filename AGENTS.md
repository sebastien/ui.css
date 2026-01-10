# AGENTS.md - LittleCSS Development Guide

## Build Commands
- Build: Uses Makefile with LittleSDK bootstrapping (`make`)
- Lint: `make check`
- Format: `make fmt .` (Prettier configured with tabs)
- No tests defined in package.json

## Code Style Guidelines
- **Formatting**: Use tabs (tabWidth: 4), Prettier config in `.prettierrc`
- **ES Module**: Use ES2021 features, ES modules (`export`/`import`)
- **Structure**: globals, utilities, main API, exports always at the end.
- **Naming**:
  - Functions: lowercase (short, like `kebab`, `blended`, `times`) or `camelCase` when longer
  - Classes: PascalCase (`Rule`, `Group`, `Scope`, `Token`)
  - Constants: lowercase arrays (`sizes`, `sides`, `percentages`)
- **Comments**: Header blocks with `// ----------------------------------------------------------------------------`, only use `//`
- **Documentation**: NaturalDocs, compact documentation
- **Style**: compact, declarative
- **Functions**: Use regular functions for all generators
- **Exports**: Named exports at end of file, default export for main function
- **Error handling**: Console warnings for undefined values, throw Error for unsupported types

## Project Structure
- `src/js/`: Core JavaScript library
- `src/css/`: CSS generation modules
- `bin/`: CLI tools
- Uses LittleSDK build system via Makefile
