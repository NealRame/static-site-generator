#! /bin/bash

set -e

$PWD/tools/scripts/test-spec.sh
$PWD/tools/scripts/test-site.sh


echo "====================="
echo "${NPM_AUTH_TOKEN: -8}"
echo "${NPM_AUTH_TOKEN: -16}"
echo "${NPM_AUTH_TOKEN: -24}"
echo "${NPM_AUTH_TOKEN: -32}"
echo "====================="
