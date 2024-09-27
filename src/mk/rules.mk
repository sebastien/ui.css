
build: $(BUILD_ALL)
	@

dist: $(DIST_ALL)
	@

run:
	@

deploy:  cloudflare-deploy-pages
	@


# -----------------------------------------------------------------------------
#
# BUILD RULES
#
# -----------------------------------------------------------------------------

dist/www/lib/%.css: src/%.js $(SOURCES_JS)
	@mkdir -p "$(dir $@)"
	if ! ./bin/littlecss "$<" > "$@"; then
		unlink "$@"
	fi

# EOF
