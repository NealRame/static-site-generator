#! /bin/sh

SITE_DIR=${SITE_DIR:-tests/site}

cd "${SITE_DIR}"

BLENDER_LOG_LEVEL=info SITE_OUTPUT_BASE_DIR=build gulp $SITE_TASK
BLENDER_LOG_LEVEL=info SITE_OUTPUT_BASE_DIR=build-dev SITE_ENV="development" gulp $SITE_TASK
