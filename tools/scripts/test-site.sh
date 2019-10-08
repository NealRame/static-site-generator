#! /bin/bash

SITE_DIR=${SITE_DIR:-test/site}
SITE_TASK=${SITE_TASK:-build}

source "$PWD/tools/scripts/.env"

pushd "${SITE_DIR}"
NODE_ENV="development" gulp $SITE_TASK
popd
