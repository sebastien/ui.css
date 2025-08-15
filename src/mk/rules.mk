
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

# FIXME: Not sure that's excuted
dist/www/lib/%.css: src/%.js $(SOURCES_JS)
	@mkdir -p "$(dir $@)"
	if ! ./bin/littlecss "$<" > "$@.tmp"; then
		unlink "$@.tmp"
		exit 1
	fi
	if ! bun build --minify "$@.tmp" > "$@"; then
		unlink "$@"
		exit 1
	fi

# EOF
