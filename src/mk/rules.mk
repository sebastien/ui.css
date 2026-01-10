
run:
	@

deploy: $(DIST_ALL)
	@
	rsync -rv dist/www/ pgs.sh:/littlecss


# EOF
