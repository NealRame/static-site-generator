#! /bin/bash

SITE_DIR=${SITE_DIR:-tests/site}
SITE_TASK=${SITE_TASK:-build}

source "$PWD/tools/scripts/.env"

pushd "${SITE_DIR}"

SITE_OUTPUT_BASE_DIR=build gulp $SITE_TASK
SITE_OUTPUT_BASE_DIR=build-dev SITE_ENV="development" gulp $SITE_TASK

popd
