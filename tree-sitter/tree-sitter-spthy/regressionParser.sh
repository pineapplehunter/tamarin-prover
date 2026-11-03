#!/usr/bin/env bash
set -euo pipefail
cd -- "$(dirname -- "${BASH_SOURCE[0]}")"

# These directories contain fragments, intentionally invalid inputs, or retired syntax.
find ../../examples -type d \( -name 'deprecated' -o -name 'not-working' -o -name 'include' -o -name 'negative' \) -prune -o \
  \( -name '*.spthy' -o -name '*.sapic' \) ! -name 'defaultoracle.spthy' -print0 |
  xargs -0 "${TREE_SITTER:-tree-sitter}" parse --quiet --stat
