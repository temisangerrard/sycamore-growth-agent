#!/bin/zsh
set -eu
cd -- "${0:A:h}"
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
if curl -fsS "http://127.0.0.1:4317/api/status" >/dev/null 2>&1; then
  open "http://127.0.0.1:4317"
  exit
fi
node server.mjs &
server_pid=$!
trap 'kill "$server_pid" 2>/dev/null || true' EXIT
for attempt in {1..30}; do
  if curl -fsS "http://127.0.0.1:4317/api/status" >/dev/null 2>&1; then
    open "http://127.0.0.1:4317"
    wait "$server_pid"
    exit
  fi
  sleep 0.2
done
echo "Sycamore could not start. Check that Node.js is installed and port 4317 is available."
exit 1
