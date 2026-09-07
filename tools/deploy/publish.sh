#!/usr/bin/env bash
# Publish site files to Hostinger. Fill REMOTE, then run from repo root:
#   ./tools/deploy/publish.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
EXCLUDE="$ROOT/tools/deploy/rsync-exclude.txt"
REMOTE="${HOSTINGER_RSYNC_TARGET:-user@your-host:public_html/}"

if [[ "$REMOTE" == "user@your-host:public_html/" ]]; then
  echo "Set HOSTINGER_RSYNC_TARGET, e.g. export HOSTINGER_RSYNC_TARGET='account@host:public_html/'"
  echo "Example: rsync -av --delete --exclude-from=$EXCLUDE $ROOT/ $REMOTE"
  exit 1
fi

rsync -av --delete --exclude-from="$EXCLUDE" "$ROOT/" "$REMOTE"
echo "Published to $REMOTE"
