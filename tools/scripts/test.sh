#! /bin/bash

set -e

$PWD/tools/scripts/test-spec.sh
$PWD/tools/scripts/test-site.sh


echo "====================="
echo "$NPM_AUTH_TOKEN"
echo "====================="
