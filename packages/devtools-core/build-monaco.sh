#!/usr/bin/env bash

set -e
set -u

MODULE_ROOT='../../node_modules'
DIST='dist'

mkdir -p "$DIST"

rm -rf "${DIST}/vs"
cp -R "${MODULE_ROOT}/monaco-editor/min/vs" "$DIST"

rm -rf "${DIST}/grammars"
cp -R 'src/DevTools/components/Editor/grammars' "${DIST}/grammars"
