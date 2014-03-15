#!/bin/sh

# bail immediately on error
set -e

# execute test files
npm test

# documentation build
node scripts/generate.js

# create the commit, tag the commit with the proper version
git add --all
git commit -am "README.md generation for $npm_package_version version"

git tag $npm_package_version
git push
git push --tags
