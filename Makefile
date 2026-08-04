
# --
#  LittleSDK Bootstrapping
SDK_PATH=deps/sdk
SDK_REPO=littletoolkit/littlesdk
include $(if $(SDK_PATH),$(shell \
	CDPATH=; \
	test -e "$(SDK_PATH)/setup.mk" || { \
		R=$$(awk '/^deps\/sdk /{print $$4}' .gitdeps 2>/dev/null); \
		git clone git@github.com:$(SDK_REPO).git "$(SDK_PATH)"; \
		test -z "$$R" && { D=$$(git log -1 --format=%ci); R=$$(cd "$(SDK_PATH)" && git log --before="$$D" -1 --format=%H); }; \
		test -n "$$R" && cd "$(SDK_PATH)" && git checkout -q "$$R"; \
	}; \
	echo "$(SDK_PATH)/setup.mk" \
))

# EOF
