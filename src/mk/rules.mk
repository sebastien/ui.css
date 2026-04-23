
run:
	@

build/css/%.css: src/css/%.js
	@mkdir -p "$(dir $@)"
	./bin/uicss "$<" > "$@"

dist/ui.css:
	@mkdir -p dist
	./bin/uicss > "$@"

deploy: $(DIST_ALL)
	@
	rsync -rv dist/www/ pgs.sh:/ui.css


# EOF
