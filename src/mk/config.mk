SOURCES_CSSJS=$(wildcard src/css/*.js)
PRODUCT_CSS=$(SOURCES_CSSJS:src/css/%.js=dist/www/lib/css/%.css)
BUILD_ALL+=$(PRODUCT_CSS)
CLOUDFLARE_PAGES_ALL=$(PRODUCT_CSS)
