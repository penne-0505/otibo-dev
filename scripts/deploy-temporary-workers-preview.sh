#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
MODE="deploy"
WORKER_NAME="otibo-baseline-preview"
ASSET_LIMIT_BYTES=5242880
ASSET_TARGET_BYTES=4800000

usage() {
  printf '%s\n' \
    "Usage: scripts/deploy-temporary-workers-preview.sh [--prepare-only] [--name <worker-name>]" \
    "" \
    "Builds the current worktree in an isolated directory, adapts oversized image assets," \
    "and deploys the static export through an unauthenticated Temporary Workers account."
}

while (($# > 0)); do
  case "$1" in
    --prepare-only)
      MODE="prepare"
      shift
      ;;
    --name)
      if (($# < 2)); then
        printf '%s\n' "Missing value for --name" >&2
        exit 2
      fi
      WORKER_NAME="$2"
      shift 2
      ;;
    --help | -h)
      usage
      exit 0
      ;;
    *)
      printf 'Unknown argument: %s\n' "$1" >&2
      usage >&2
      exit 2
      ;;
  esac
done

for command_name in date file find curl rsync npm; do
  if ! command -v "$command_name" >/dev/null 2>&1; then
    printf 'Required command is unavailable: %s\n' "$command_name" >&2
    exit 1
  fi
done

STAGE_DIR="$(mktemp -d /tmp/otibo-temporary-workers-preview-XXXXXX)"
SOURCE_DIR="$STAGE_DIR/source"
ASSETS_DIR="$STAGE_DIR/assets"
CONFIG_PATH="$STAGE_DIR/wrangler.temporary.jsonc"
DEPLOY_LOG="$STAGE_DIR/deploy.log"
RESIZED_LOG="$STAGE_DIR/resized-assets.txt"

mkdir -p "$SOURCE_DIR" "$ASSETS_DIR"

rsync -a \
  --exclude='.git/' \
  --exclude='.next/' \
  --exclude='node_modules/' \
  --exclude='out/' \
  --exclude='.wrangler/' \
  --exclude='.codex/' \
  --exclude='.openai/' \
  --exclude='.agents/' \
  --exclude='.claude/' \
  --exclude='.github/' \
  --exclude='_docs/' \
  --exclude='_evals/' \
  --exclude='coverage/' \
  --exclude='prototypes/' \
  --exclude='tmp/' \
  "$ROOT_DIR/" "$SOURCE_DIR/"

check_build_environment() {
  local env_file key
  local -a env_files=(
    "$SOURCE_DIR/.env"
    "$SOURCE_DIR/.env.local"
    "$SOURCE_DIR/.env.production"
    "$SOURCE_DIR/.env.production.local"
  )

  for env_file in "${env_files[@]}"; do
    [[ -f "$env_file" ]] || continue
    while IFS= read -r key; do
      [[ -n "$key" ]] || continue
      case "$key" in
        OWNER_NAME | OWNER_ADDRESS | OWNER_PHONE | EFFECTIVE_DATE | NEXT_PUBLIC_*)
          ;;
        *)
          printf 'Refusing to publish with an unreviewed build variable: %s (%s)\n' \
            "$key" "${env_file#"$SOURCE_DIR/"}" >&2
          exit 1
          ;;
      esac
    done < <(sed -nE 's/^[[:space:]]*(export[[:space:]]+)?([A-Za-z_][A-Za-z0-9_]*)=.*/\2/p' "$env_file")
  done
}

check_build_environment

(
  cd "$SOURCE_DIR"
  npm ci
)

(
  cd "$SOURCE_DIR"
  npm run build
)

if [[ ! -f "$SOURCE_DIR/out/index.html" ]]; then
  printf '%s\n' "Build did not produce out/index.html" >&2
  exit 1
fi

cp -a "$SOURCE_DIR/out/." "$ASSETS_DIR/"
: >"$RESIZED_LOG"

resize_oversized_image() {
  local asset="$1"
  local mime size scale tmp extension attempts=0

  mime="$(file --brief --mime-type "$asset")"
  # intent: DEC-003 (Workflow/temporary-workers-preview-skill) — arbitrary byte splitting breaks consumer URLs and decoding.
  if [[ "$mime" != image/* ]]; then
    printf 'Oversized non-image asset requires an app-aware transform: %s (%s bytes, %s)\n' \
      "${asset#"$ASSETS_DIR/"}" "$(stat -c '%s' "$asset")" "$mime" >&2
    return 1
  fi
  if ! command -v magick >/dev/null 2>&1; then
    printf 'ImageMagick is required to resize oversized preview asset: %s\n' \
      "${asset#"$ASSETS_DIR/"}" >&2
    return 1
  fi

  extension="${asset##*.}"
  while (( "$(stat -c '%s' "$asset")" > ASSET_TARGET_BYTES )); do
    attempts=$((attempts + 1))
    if ((attempts > 8)); then
      printf 'Could not reduce preview asset below %s bytes: %s\n' \
        "$ASSET_TARGET_BYTES" "${asset#"$ASSETS_DIR/"}" >&2
      return 1
    fi

    size="$(stat -c '%s' "$asset")"
    if ((size > ASSET_LIMIT_BYTES * 2)); then
      scale=50
    else
      scale=80
    fi
    tmp="${asset%.*}.preview-resize.${extension}"
    magick "$asset" -resize "${scale}%" "$tmp"
    mv -f "$tmp" "$asset"
  done

  printf '%s\t%s\n' "${asset#"$ASSETS_DIR/"}" "$(stat -c '%s' "$asset")" >>"$RESIZED_LOG"
}

while IFS= read -r -d '' oversized_asset; do
  resize_oversized_image "$oversized_asset"
done < <(find "$ASSETS_DIR" -type f -size +"${ASSET_LIMIT_BYTES}"c -print0)

if find "$ASSETS_DIR" -type f -size +"${ASSET_LIMIT_BYTES}"c -print -quit | grep -q .; then
  printf '%s\n' "At least one preview asset still exceeds the Temporary Workers limit." >&2
  exit 1
fi

cat >"$CONFIG_PATH" <<EOF
{
  "\$schema": "$SOURCE_DIR/node_modules/wrangler/config-schema.json",
  "name": "$WORKER_NAME",
  "compatibility_date": "$(date +%F)",
  "assets": {
    "directory": "$ASSETS_DIR",
    "html_handling": "auto-trailing-slash",
    "not_found_handling": "404-page"
  }
}
EOF

printf 'Prepared preview artifact: %s\n' "$ASSETS_DIR"
printf 'Prepared temporary config: %s\n' "$CONFIG_PATH"
if [[ -s "$RESIZED_LOG" ]]; then
  printf '%s\n' "Preview-only resized assets:"
  sed 's/^/  /' "$RESIZED_LOG"
fi

if [[ "$MODE" == "prepare" ]]; then
  exit 0
fi

STATE_DIR="${XDG_RUNTIME_DIR:-/tmp}/otibo-temporary-workers-preview-state"
mkdir -p "$STATE_DIR/home" "$STATE_DIR/config"

# intent: DEC-002 (Workflow/temporary-workers-preview-skill) — preview deployment must not mutate the user's permanent login.
(
  cd "$SOURCE_DIR"
  env \
    -u CLOUDFLARE_API_TOKEN \
    -u CLOUDFLARE_API_KEY \
    -u CLOUDFLARE_EMAIL \
    CI=1 \
    HOME="$STATE_DIR/home" \
    XDG_CONFIG_HOME="$STATE_DIR/config" \
    "$SOURCE_DIR/node_modules/.bin/wrangler" deploy \
      --config "$CONFIG_PATH" \
      --temporary
) 2>&1 | tee "$DEPLOY_LOG"

DEPLOY_URL="$(grep -Eo 'https://[^[:space:]]+\.workers\.dev' "$DEPLOY_LOG" | tail -1 || true)"
CLAIM_URL="$(grep -Eo 'https://dash\.cloudflare\.com/claim-preview\?claimToken=[^[:space:]]+' "$DEPLOY_LOG" | tail -1 || true)"

if [[ -z "$DEPLOY_URL" ]]; then
  printf 'Wrangler completed without a workers.dev URL. Inspect: %s\n' "$DEPLOY_LOG" >&2
  exit 1
fi

verify_url() {
  local url="$1"
  local label="$2"
  local status attempt

  for attempt in {1..12}; do
    status="$(curl -L -sS -o /dev/null -w '%{http_code}' "$url" || true)"
    if [[ "$status" == "200" ]]; then
      printf 'Verified %s: HTTP 200\n' "$label"
      return 0
    fi
    sleep 1
  done

  printf 'Preview verification failed for %s: HTTP %s\n' "$label" "$status" >&2
  return 1
}

while IFS= read -r -d '' index_file; do
  relative_path="${index_file#"$ASSETS_DIR/"}"
  case "$relative_path" in
    404/index.html | _not-found/index.html)
      continue
      ;;
  esac
  route="/${relative_path%index.html}"
  verify_url "${DEPLOY_URL}${route}" "$route"
done < <(find "$ASSETS_DIR" -type f -name index.html -print0 | sort -z)

while IFS=$'\t' read -r resized_path _; do
  [[ -n "$resized_path" ]] || continue
  verify_url "${DEPLOY_URL}/${resized_path}" "/${resized_path}"
done <"$RESIZED_LOG"

printf 'Temporary Workers URL: %s\n' "$DEPLOY_URL"
if [[ -n "$CLAIM_URL" ]]; then
  printf 'Claim URL (bearer credential, do not share): %s\n' "$CLAIM_URL"
fi
printf 'Deployment evidence: %s\n' "$STAGE_DIR"
