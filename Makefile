
# --
#  LittleDevKit Bootstrapping
KIT_PATH=deps/sdk
include $(if $(KIT_PATH),$(shell test ! -e "$(KIT_PATH)/setup.mk" && git clone git@github.com:sebastien/littlesdk.git "$(KIT_PATH)";echo "$(KIT_PATH)/setup.mk"))

# EOF
