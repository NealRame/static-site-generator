#! /bin/bash

set -e

$PWD/tools/scripts/test-spec.sh
$PWD/tools/scripts/test-site.sh


echo "====================="
echo "${NPM_AUTH_TOKEN: -8}"
echo "${NPM_AUTH_TOKEN: -16}"
echo "${NPM_AUTH_TOKEN: -24}"
echo "${NPM_AUTH_TOKEN: -32}"
echo "${NPM_AUTH_TOKEN: -40}"
echo "${NPM_AUTH_TOKEN: -48}"
echo "${NPM_AUTH_TOKEN: -56}"
echo "${NPM_AUTH_TOKEN: -64}"
echo "====================="
