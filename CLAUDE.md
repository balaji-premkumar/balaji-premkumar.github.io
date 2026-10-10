# CLAUDE.md

@AGENTS.md

## Claude Code specifics

- Shared project rules live in AGENTS.md (imported above); keep them there so every agent sees the same guidance.
  Put only Claude-specific notes in this file.
- Visual checks: drive headless Chrome with a Playwright script in your scratchpad (see "Verifying visual work"),
  and read the screenshots back before claiming a UI change works.
- Lighthouse: the chrome-devtools MCP `lighthouse_audit` tool against `bunx vite preview` (production build), not
  the dev server.
- Long-running servers (`bun run dev`, `vite preview`) go in the background; stop them when done. `pkill` exits
  with 144 in this shell, so don't chain other commands after it.
- Avatar/art tooling: Blender runs headless via `art/blender/blbg.sh`; image generation uses the local
  Antigravity CLI (`agy`), whose outputs land in `~/.gemini/antigravity-cli/brain/`, not the working directory.
