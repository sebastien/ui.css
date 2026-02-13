
run:
	@

dist/littlecss.css:
	@mkdir -p dist
	./bin/littlecss > "$@"

deploy: $(DIST_ALL)
	@
	rsync -rv dist/www/ pgs.sh:/littlecss


# EOF
