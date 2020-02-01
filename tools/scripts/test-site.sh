#! /bin/sh

set -e

PATH=$PATH:"$PWD/node_modules/.bin"
SITE_DIR=${SITE_DIR:-tests/site}

cd "${SITE_DIR}"

rm -fr build
BLENDER_LOG_LEVEL=info SITE_OUTPUT_BASE_DIR=build gulp $SITE_TASK
if ! test -d build;
then
	>&2 echo "build dir does not exists!"
	exit 1
fi

BLENDER_LOG_LEVEL=info SITE_OUTPUT_BASE_DIR=build-dev SITE_ENV="development" gulp $SITE_TASK
if ! test -d build-dev;
then
	>&2 echo "build dir does not exists!"
	exit 1
fi
if ! test -f build-dev/scripts/foo.js.map;
then
	>&2 echo "build-dev/scripts/foo.js.map file does not exists!"
	exit 1
fi
if ! test -f build-dev/scripts/bar.js.map;
then
	>&2 echo "build-dev/scripts/bar.js.map file does not exists!"
	exit 1
fi
if ! test -f build-dev/css/style.css.map;
then
	>&2 echo "build-dev/css/style.css.map file does not exists!"
	exit 1
fi
