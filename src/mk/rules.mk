build/css/%.css: src/css/%.js
	@mkdir -p "$(dir $@)"
	./bin/uicss "$<" > "$@"
	$(call rule_post_cmd)

dist/ui.css: $(SOURCES_JS) $(SOURCES_CSSJS)
	@mkdir -p dist
	./bin/uicss > "$@"
	$(call rule_post_cmd)

dist/ui.min.css: $(SOURCES_JS) $(SOURCES_CSSJS)
	@mkdir -p dist
	./bin/uicss --compact > "$@"
	$(call rule_post_cmd)

dist/uicss.json: $(SOURCES_JS) $(SOURCES_CSSJS)
	@mkdir -p dist
	./bin/uicss --catalog > "$@"
	$(call rule_post_cmd)

dist/ui.embed.css: $(SOURCES_JS) $(SOURCES_CSSJS)
	@mkdir -p dist
	./bin/uicss --embed --guard ".uicss" > "$@"
	$(call rule_post_cmd)

dist/ui.embed.min.css: $(SOURCES_JS) $(SOURCES_CSSJS)
	@mkdir -p dist
	./bin/uicss --compact --embed --guard ".uicss" > "$@"
	$(call rule_post_cmd)

.PHONY: browser-test browser-install
browser-test: dist/ui.css ## Runs Chromium computed-style tests
	bunx playwright test

browser-install: ## Installs the Chromium browser for browser tests
	bunx playwright install chromium

# EOF
