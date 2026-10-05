#!/usr/bin/env python3
"""
Run a Python file inside the open Blender via the Blender Lab MCP add-on socket (127.0.0.1:9876).

    python3 art/blender/bl.py art/blender/build_avatar.py

Same channel the MCP `execute_blender_code` tool uses; handy when the MCP tools aren't loaded.
Inside the script, assign to `result` to get a JSON value back.
"""
import json
import socket
import sys

code = open(sys.argv[1]).read() if len(sys.argv) > 1 else sys.stdin.read()
with socket.create_connection(("127.0.0.1", 9876), timeout=600) as s:
    s.sendall((json.dumps({"type": "execute", "code": code, "strict_json": False}) + "\0").encode())
    buf = b""
    while not buf.endswith(b"\0"):
        chunk = s.recv(1 << 16)
        if not chunk:
            break
        buf += chunk

res = json.loads(buf.rstrip(b"\0"))
print(json.dumps(res, indent=2)[:4000])
sys.exit(0 if res.get("status") == "ok" else 1)
