#!/bin/bash
set -euo pipefail

EXTENSION_UUID="$(jq -r '.uuid' metadata.json)"
PARENT_PATH="$(cd .. && pwd)"
PACKAGE_PATH="${PARENT_PATH}/${EXTENSION_UUID}-package"
PACKAGE_FILE="${PARENT_PATH}/${EXTENSION_UUID}.zip"

function finish {
  rm -rf "${PACKAGE_PATH}"
}
trap finish EXIT

rm -r -f "${PACKAGE_PATH}"
cp -r "${PWD}" "${PACKAGE_PATH}"
rm -r -f "${PACKAGE_PATH}/.git"
eval rm -f "${PACKAGE_PATH}/*.sh"
rm "${PACKAGE_FILE}"
cd "${PACKAGE_PATH}"
zip -r "${PACKAGE_FILE}" "./"
