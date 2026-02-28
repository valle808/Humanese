#!/usr/bin/env bash
# Humanese Guardian Agent — deep health check
# Outputs: health_status (JSON summary) and needs_fix (true/false)

set -euo pipefail

ISSUES=()
HEALTH_REPORT=()

log() { echo "[guardian:health] $*"; }

# ── Helper: validate JSON file ────────────────────────────────────────────────
validate_json_file() {
  local service="$1"
  local file="$2"
  if [[ -f "$file" ]]; then
    if node -e "JSON.parse(require('fs').readFileSync('${file}','utf8'))" 2>/dev/null; then
      HEALTH_REPORT+=("{\"service\":\"${service}\",\"status\":\"ok\"}")
      log "${file}: OK"
    else
      HEALTH_REPORT+=("{\"service\":\"${service}\",\"status\":\"error\",\"message\":\"invalid JSON\"}")
      ISSUES+=("$service")
      log "${file}: invalid JSON"
    fi
  else
    HEALTH_REPORT+=("{\"service\":\"${service}\",\"status\":\"warning\",\"message\":\"${file} not found\"}")
    ISSUES+=("${service}_missing")
    log "${file}: missing"
  fi
}

# ── 1. Next.js build check ────────────────────────────────────────────────────
log "Running Next.js build check..."
if npm run build --silent > /dev/null 2>&1; then
  HEALTH_REPORT+=('{"service":"nextjs_build","status":"ok"}')
  log "Next.js build: OK"
else
  HEALTH_REPORT+=('{"service":"nextjs_build","status":"error","message":"build failed"}')
  ISSUES+=("nextjs_build")
  log "Next.js build: FAILED"
fi

# ── 2. Vercel deployment status ───────────────────────────────────────────────
if [[ -n "${VERCEL_TOKEN:-}" && -n "${VERCEL_PROJECT_ID:-}" ]]; then
  log "Checking Vercel deployment status..."
  HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
    -H "Authorization: Bearer ${VERCEL_TOKEN}" \
    "https://api.vercel.com/v6/deployments?projectId=${VERCEL_PROJECT_ID}&limit=1" || echo "000")
  if [[ "$HTTP_STATUS" == "200" ]]; then
    HEALTH_REPORT+=('{"service":"vercel","status":"ok"}')
    log "Vercel API: OK"
  else
    HEALTH_REPORT+=("{\"service\":\"vercel\",\"status\":\"warning\",\"http_status\":\"${HTTP_STATUS}\"}")
    ISSUES+=("vercel")
    log "Vercel API: HTTP ${HTTP_STATUS}"
  fi
else
  HEALTH_REPORT+=('{"service":"vercel","status":"skipped","message":"no credentials"}')
  log "Vercel check: skipped (no credentials)"
fi

# ── 3. Supabase connectivity ──────────────────────────────────────────────────
if [[ -n "${NEXT_PUBLIC_SUPABASE_URL:-}" ]]; then
  log "Checking Supabase connectivity..."
  HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
    "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/" \
    -H "apikey: ${NEXT_PUBLIC_SUPABASE_ANON_KEY:-}" || echo "000")
  if [[ "$HTTP_STATUS" =~ ^(200|401|403)$ ]]; then
    HEALTH_REPORT+=('{"service":"supabase","status":"ok"}')
    log "Supabase: OK (HTTP ${HTTP_STATUS})"
  else
    HEALTH_REPORT+=("{\"service\":\"supabase\",\"status\":\"warning\",\"http_status\":\"${HTTP_STATUS}\"}")
    ISSUES+=("supabase")
    log "Supabase: HTTP ${HTTP_STATUS}"
  fi
else
  HEALTH_REPORT+=('{"service":"supabase","status":"skipped","message":"no credentials"}')
  log "Supabase check: skipped (no credentials)"
fi

# ── 4. Firebase project check ─────────────────────────────────────────────────
if [[ -n "${NEXT_PUBLIC_FIREBASE_PROJECT_ID:-}" ]]; then
  log "Checking Firebase project..."
  HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
    "https://firebaseapp.com/${NEXT_PUBLIC_FIREBASE_PROJECT_ID}" || echo "000")
  if [[ "$HTTP_STATUS" =~ ^(200|301|302|403)$ ]]; then
    HEALTH_REPORT+=('{"service":"firebase","status":"ok"}')
    log "Firebase: OK (HTTP ${HTTP_STATUS})"
  else
    HEALTH_REPORT+=("{\"service\":\"firebase\",\"status\":\"warning\",\"http_status\":\"${HTTP_STATUS}\"}")
    log "Firebase: HTTP ${HTTP_STATUS} (non-critical)"
  fi
else
  HEALTH_REPORT+=('{"service":"firebase","status":"skipped","message":"no project id"}')
  log "Firebase check: skipped (no project id)"
fi

# ── 5. MCP server config validation ──────────────────────────────────────────
log "Validating MCP server config..."
validate_json_file "mcp_config" "mcp-config.json"

# ── 6. vercel.json validation ─────────────────────────────────────────────────
log "Validating vercel.json..."
validate_json_file "vercel_config" "vercel.json"

# ── Summary ───────────────────────────────────────────────────────────────────
REPORT_JSON="[$(IFS=','; echo "${HEALTH_REPORT[*]}")]"
log "Health report: ${REPORT_JSON}"

if [[ ${#ISSUES[@]} -gt 0 ]]; then
  log "Issues detected: ${ISSUES[*]}"
  echo "health_status=${REPORT_JSON}" >> "${GITHUB_OUTPUT:-/dev/stdout}"
  echo "needs_fix=true" >> "${GITHUB_OUTPUT:-/dev/stdout}"
else
  log "All systems healthy"
  echo "health_status=${REPORT_JSON}" >> "${GITHUB_OUTPUT:-/dev/stdout}"
  echo "needs_fix=false" >> "${GITHUB_OUTPUT:-/dev/stdout}"
fi
