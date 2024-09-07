
# --
#  LittleDevKit Bootstrapping
KIT_PATH=deps/ldk
include $(if $(KIT_PATH),$(shell test ! -e "$(KIT_PATH)/setup.mk" && git clone git@github.com:sebastien/littledevkit.git "$(KIT_PATH)";echo "$(KIT_PATH)/setup.mk"))

# EOF
