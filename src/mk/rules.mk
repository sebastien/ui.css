build/css/%.css: src/css/%.js
	@mkdir -p "$(dir $@)"
	./bin/uicss "$<" > "$@"
	$(call rule_post_cmd)

dist/ui.css: $(SOURCES_JS) $(SOURCES_CSSJS)
	@mkdir -p dist
	./bin/uicss > "$@"
	$(call rule_post_cmd)

deploy: $(DIST_ALL)
	@
	rsync -rv dist/www/ pgs.sh:/ui.css


# EOF
