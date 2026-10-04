#!/usr/bin/env bash
# Generate site art via agy (Nano Banana). Output lands in agy brain dir; copy it here.
cd "$(dirname "$0")"
STYLE="dark background #0a0a0f, single accent colour lime #c8f060 with subtle cyan #60c8f0 rim light, volumetric glow, minimal, abstract 3D render, no text, no letters, no logos, 16:9 wide aspect ratio, high detail, lots of negative space"
declare -A P=(
  [proj-sql-notebook]="Floating translucent glass notebook cells stacked vertically, each holding glowing abstract data tables and query result grids, a code editor window frame around them"
  [proj-react-devicons]="Grid of floating glass tiles each holding a different simple glowing abstract symbol, an atom-like orbit motif hovering at the centre"
)
for name in "${!P[@]}"; do
  [ -f "$name.jpg" ] && { echo "skip $name"; continue; }
  marker=$(mktemp); sleep 1
  agy -p "Use your image generation tool (Nano Banana) to generate exactly ONE image. Do not write code. Image prompt: ${P[$name]}, $STYLE." \
    --mode accept-edits --model gemini-3.8-flash-medium --print-timeout 280s >/dev/null 2>&1
  for i in $(seq 1 60); do
    f=$(find ~/.gemini/antigravity-cli/brain -newer "$marker" -type f \( -name '*.jpg' -o -name '*.png' \) 2>/dev/null | head -1)
    [ -n "$f" ] && break; sleep 5
  done
  rm -f "$marker"
  if [ -n "$f" ]; then cp "$f" "$name.jpg"; echo "ok $name"; else echo "FAIL $name"; fi
done
echo DONE
