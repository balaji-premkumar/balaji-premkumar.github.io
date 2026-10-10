#!/usr/bin/env bash
# Run a Blender script headless (no GUI / no MCP needed): blbg.sh script.py ['PY_PRELUDE'] [file.blend]
# The script's `result` is printed as JSON on a line starting with RESULT.
set -e
script="$1"; prelude="${2:-}"; blend="${3:-}"
tmp=$(mktemp --suffix=.py)
{ echo "$prelude"; cat "$script"; echo; echo 'import json; print("RESULT", json.dumps(globals().get("result"), default=str))'; } > "$tmp"
blender -b $blend --python "$tmp" --python-exit-code 1 2>&1 | grep -E '^RESULT|Error|Traceback|Heat|heat' ; rm -f "$tmp"
