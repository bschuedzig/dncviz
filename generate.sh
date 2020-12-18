#!/bin/bash
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

DG_FILE="$DIR/out/graph.dg"

# make sure we are in the directory of the script
cd "$DIR"

mkdir out 2>/dev/null || :

SLN_FILE="${1:-}"

if [[ -z "$SLN_FILE" ]]; then
    echo "Please specify the .sln file"
    exit 1
fi

if [[ ! -f "$SLN_FILE" ]]; then
    echo "$SLN_FILE does not exist"
    exit 1
fi

echo "Generating dependency graph"
dotnet msbuild /t:GenerateRestoreGraphFile /p:RestoreGraphOutputPath="$DG_FILE" "$SLN_FILE"

echo "Transforming to DOT syntax"
yarn start "$DG_FILE" "out/with_test.dot"
yarn start "$DG_FILE" "out/without_test.dot" "\\.Test"

echo "Invoking graphviz"
dot -Tpng -Kdot out/with_test.dot -o out/output_with_test.png
dot -Tsvg -Kdot out/with_test.dot -o out/output_with_test.svg

dot -Tpng -Kdot out/without_test.dot -o out/output_without_test.png
dot -Tsvg -Kdot out/without_test.dot -o out/output_without_test.svg
