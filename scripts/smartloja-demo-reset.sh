#!/usr/bin/env bash
# Recria o banco de demonstração do clone isolado do Smart Loja e popula com dados fictícios.
# Uso: scripts/smartloja-demo-reset.sh <clone>/backend
# Nunca aponte para o projeto original: o banco real dele fica em data/smartloja.sqlite.
set -euo pipefail
B="$(cd "$1" && pwd)"
case "$B" in *scratchpad*|*demo-clone*) ;; *) echo "recuso: $B não parece um clone isolado"; exit 1 ;; esac
HERE="$(cd "$(dirname "$0")" && pwd)"
cd "$B"
export DB_FILENAME=./data/portfolio-demo.sqlite PORT=3344 CORS_ORIGIN=http://localhost:5180
rm -f data/portfolio-demo.sqlite data/portfolio-demo.sqlite-wal data/portfolio-demo.sqlite-shm
npm run -s db:setup > /dev/null
node node_modules/tsx/dist/cli.mjs src/index.ts > data/portfolio-demo-api.log 2>&1 &
API=$!
trap 'kill $API 2>/dev/null || true' EXIT
for i in $(seq 1 30); do
  curl -s -o /dev/null http://localhost:3344/api/sistema/saude && break
  sleep 1
done
node "$HERE/smartloja-demo-data.mjs" "$B"
