SOURCES_CSSJS=$(wildcard src/css/*.js)
SOURCES_JS=$(wildcard src/js/*.js)
BUILD_ALL+=
DIST_ALL+=dist/ui.css dist/ui.min.css dist/ui.embed.css dist/ui.embed.min.css dist/uicss.json
TEST_ALL+=browser-test

PROJECT:=ui
PROJECT_VERSION:=1.0.0

# Release module (deps/sdk/src/mk/sdk/release)
RELEASE_FILES:=dist/ui.css dist/ui.min.css dist/ui.embed.css dist/ui.embed.min.css dist/uicss.json
RELEASE_VERSION_FILES:=package.json src/js/uicss.js README.md
RELEASE_VERSION_EXTRA=node --input-type=module -e 'import fs from "node:fs"; const version=process.env.VERSION; const replacements=[["src/js/uicss.js", /VERSION = "[^"]+"/, `VERSION = "$${version}"`],["README.md", /ui\.css@v[0-9]+\.[0-9]+\.[0-9]+/, `ui.css@v$${version}`]]; for (const [path, pattern, value] of replacements) { const source=fs.readFileSync(path, "utf8"); fs.writeFileSync(path, source.replace(pattern, value)) }'
