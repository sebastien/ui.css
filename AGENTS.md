# AGENTS.md - LittleCSS Development Guide

## Build Commands
- Build: Uses Makefile with LittleDevKit bootstrapping (`make`)
- Lint: `npx eslint src/` (ESLint configured)
- Format: `npx prettier --write .` (Prettier configured with tabs)
- No tests defined in package.json

## Code Style Guidelines
- **Formatting**: Use tabs (tabWidth: 4), Prettier config in `.prettierrc`
- **ES Module**: Use ES2021 features, ES modules (`export`/`import`)
- **Naming**: 
  - Functions: camelCase (`kebab`, `blended`, `times`)
  - Classes: PascalCase (`Rule`, `Group`, `Scope`, `Token`)
  - Constants: lowercase arrays (`sizes`, `sides`, `percentages`)
- **Comments**: Header blocks with `// ----------------------------------------------------------------------------`
- **Functions**: Use arrow functions for utilities, regular functions for generators
- **Exports**: Named exports at end of file, default export for main function
- **String handling**: Use template literals, `replaceAll()` for string replacement
- **Error handling**: Console warnings for undefined values, throw Error for unsupported types

## Project Structure
- `src/js/`: Core JavaScript library
- `src/css/`: CSS generation modules
- `bin/`: CLI tools
- Uses LittleDevKit build system via Makefile