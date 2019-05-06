#!/bin/bash
set -euo pipefail

EXTENSION_UUID="$(jq -r '.uuid' metadata.json)"
TARGET_PATH="${HOME}/.local/share/gnome-shell/extensions/${EXTENSION_UUID}"

glib-compile-schemas schemas
rm -r -f "${TARGET_PATH}"
cp -r "${PWD}" "${TARGET_PATH}"
