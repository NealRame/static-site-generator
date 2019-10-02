#! /bin/bash

SITE_DIR=${SITE_DIR:-test/site}

source "$PWD/tools/scripts/.env"

pushd "${SITE_DIR}"
NODE_ENV="development" gulp serve
popd
