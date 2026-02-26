"""
health_check.py – Deep health check for the Humanese Warden automation.

Exit codes:
  0  All checks passed.
  1  One or more checks failed.

Environment variables (all optional):
  TARGET_URL          Base URL to probe (default: http://localhost:3000)
  ASSET_PATHS         Comma-separated list of paths to check (overrides default list)
  LOAD_THRESHOLD      Max acceptable 1-minute load average (default: 4.0)
  ENABLE_RESTART      Set to "1" to allow nginx restart on failure (default: off)
"""

import os
import sys
import json
import platform
import subprocess

try:
    import requests
except ImportError:
    requests = None  # type: ignore[assignment]

BASE_URL = os.environ.get("TARGET_URL", "http://localhost:3000").rstrip("/")

DEFAULT_ASSET_PATHS = [
    "/static/css/style.css",
    "/static/js/app.js",
]

ASSET_PATHS = [
    p.strip()
    for p in os.environ.get("ASSET_PATHS", "").split(",")
    if p.strip()
] or DEFAULT_ASSET_PATHS

LOAD_THRESHOLD = float(os.environ.get("LOAD_THRESHOLD", "4.0"))
ENABLE_RESTART = os.environ.get("ENABLE_RESTART", "0") == "1"

TIMEOUT = 10  # seconds per request


def check_connectivity() -> dict:
    """GET the base URL and require HTTP 200."""
    result = {"check": "connectivity", "url": BASE_URL, "passed": False, "detail": ""}
    if requests is None:
        result["detail"] = "requests library not installed"
        return result
    try:
        resp = requests.get(BASE_URL, timeout=TIMEOUT)
        if resp.status_code == 200:
            result["passed"] = True
            result["detail"] = f"HTTP {resp.status_code}"
        else:
            result["detail"] = f"HTTP {resp.status_code} (expected 200)"
    except requests.exceptions.RequestException as exc:
        result["detail"] = str(exc)
    return result


def check_assets() -> list:
    """GET each asset path and require HTTP 200."""
    results = []
    if requests is None:
        for path in ASSET_PATHS:
            results.append({
                "check": "asset",
                "url": BASE_URL + path,
                "passed": False,
                "detail": "requests library not installed",
            })
        return results
    for path in ASSET_PATHS:
        url = BASE_URL + path
        entry = {"check": "asset", "url": url, "passed": False, "detail": ""}
        try:
            resp = requests.get(url, timeout=TIMEOUT)
            if resp.status_code == 200:
                entry["passed"] = True
                entry["detail"] = f"HTTP {resp.status_code}"
            else:
                entry["detail"] = f"HTTP {resp.status_code} (expected 200)"
        except requests.exceptions.RequestException as exc:
            entry["detail"] = str(exc)
        results.append(entry)
    return results


def check_system_load() -> dict:
    """Compare 1-minute load average to LOAD_THRESHOLD (Linux/macOS only)."""
    result = {"check": "system_load", "passed": False, "detail": ""}
    if platform.system() == "Windows":
        result["passed"] = True
        result["detail"] = "load check skipped on Windows"
        return result
    try:
        load1, _, _ = os.getloadavg()
        if load1 <= LOAD_THRESHOLD:
            result["passed"] = True
            result["detail"] = f"load={load1:.2f} threshold={LOAD_THRESHOLD}"
        else:
            result["detail"] = f"load={load1:.2f} exceeds threshold={LOAD_THRESHOLD}"
    except (AttributeError, OSError) as exc:
        result["detail"] = f"getloadavg unavailable: {exc}"
        result["passed"] = True  # treat as non-fatal when unavailable
    return result


def maybe_restart_nginx() -> None:
    """Optionally restart nginx; only runs when ENABLE_RESTART=1."""
    if not ENABLE_RESTART:
        return
    print("[health_check] ENABLE_RESTART is set; attempting nginx restart via systemctl")
    try:
        subprocess.run(
            ["sudo", "systemctl", "restart", "nginx"],
            check=True,
            timeout=30,
        )
        print("[health_check] nginx restarted successfully")
    except Exception as exc:  # noqa: BLE001
        print(f"[health_check] nginx restart failed: {exc}")


def run() -> int:
    """Execute all checks, print a JSON summary, and return exit code."""
    results = []
    results.append(check_connectivity())
    results.extend(check_assets())
    results.append(check_system_load())

    all_passed = all(r["passed"] for r in results)

    summary = {
        "passed": all_passed,
        "checks": results,
    }
    print(json.dumps(summary, indent=2))

    if not all_passed:
        print("[health_check] FAILED – one or more checks did not pass.", file=sys.stderr)
        maybe_restart_nginx()
        return 1

    print("[health_check] All checks passed.")
    return 0


if __name__ == "__main__":
    sys.exit(run())
