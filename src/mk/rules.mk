
build: $(BUILD_ALL)
	@

dist: $(DIST_ALL)
	@

run:
	@

deploy: $(DIST_ALL)
	@
	rsync -rv dist/www/ pgs.sh:/littlecss


# -----------------------------------------------------------------------------
#
# BUILD RULES
#
# -----------------------------------------------------------------------------

dist/www/lib/%.css: src/%.js $(SOURCES_JS)
	@mkdir -p "$(dir $@)"
	if ! ./bin/littlecss "$<" > "$@.tmp"; then
		unlink "$@"
		exit 1
	fi
	if ! bun build --minify "$@.tmp" > "$@"; then
		unlink "$@"
		exit 1
	fi

# EOF
