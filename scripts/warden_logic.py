"""
warden_logic.py – Humanese Warden autonomous cycle.

Responsibilities
----------------
1. Scan configured pages with Playwright and capture console errors.
2. Generate improvement reports and a BOSS log.
3. Optionally replicate agent files under a governed path.
4. Run scripts/health_check.py before committing; abort commit on failure.

Environment variables (all optional):
  TARGET_URL          Base URL to scan (default: http://localhost:3000)
  SCAN_PATHS          Comma-separated page paths to visit (default: /)
  MOTOR_BASE_PATH     Root directory for agent replication (default: /opt/humanese/agents)
  MAX_AGENTS          Maximum number of agent directories allowed (default: 21)
  ALLOW_REPLICATION   Set to "1" to enable agent replication (default: off)
  AGENT_NAME          Name of the agent to replicate (default: Humanese-Warden-Agent)
  ENABLE_ROLLBACK     Set to "1" to git reset --hard when health check fails in CI
"""

from __future__ import annotations

import json
import os
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

BASE_URL = os.environ.get("TARGET_URL", "http://localhost:3000").rstrip("/")
SCAN_PATHS = [
    p.strip()
    for p in os.environ.get("SCAN_PATHS", "/").split(",")
    if p.strip()
] or ["/"]

MOTOR_BASE_PATH = Path(os.environ.get("MOTOR_BASE_PATH", "/opt/humanese/agents"))
MAX_AGENTS = int(os.environ.get("MAX_AGENTS", "21"))
ALLOW_REPLICATION = os.environ.get("ALLOW_REPLICATION", "0") == "1"
AGENT_NAME = os.environ.get("AGENT_NAME", "Humanese-Warden-Agent")
ENABLE_ROLLBACK = os.environ.get("ENABLE_ROLLBACK", "0") == "1"

REPO_ROOT = Path(__file__).resolve().parent.parent
REPORTS_DIR = REPO_ROOT / "reports"
HEALTH_CHECK_SCRIPT = REPO_ROOT / "scripts" / "health_check.py"

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _ts() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def _ensure_reports_dir() -> None:
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)


# ---------------------------------------------------------------------------
# Population control / governor
# ---------------------------------------------------------------------------


def check_population() -> int:
    """Return the current number of agent directories under MOTOR_BASE_PATH."""
    if not MOTOR_BASE_PATH.exists():
        return 0
    return sum(1 for p in MOTOR_BASE_PATH.iterdir() if p.is_dir())

def replicate_agent(target_name: str) -> bool:
    """
    Copy the warden agent identity doc into MOTOR_BASE_PATH/<target_name>.

    Safety guards:
    - ALLOW_REPLICATION must be "1".
    - Population must be below MAX_AGENTS.
    - Path traversal is rejected (target_name must not contain separators).
    """
    if not ALLOW_REPLICATION:
        print("[warden] Replication is disabled (ALLOW_REPLICATION != 1)")
        return False

    # Reject path-traversal attempts: resolve the candidate path and confirm
    # it remains strictly inside MOTOR_BASE_PATH.
    try:
        resolved = (MOTOR_BASE_PATH / target_name).resolve()
        if not str(resolved).startswith(str(MOTOR_BASE_PATH.resolve()) + os.sep):
            raise ValueError("outside base path")
    except (ValueError, OSError):
        print(f"[warden] Rejected unsafe agent name: {target_name!r}")
        return False

    current = check_population()
    if current >= MAX_AGENTS:
        print(
            f"[warden] Population limit reached ({current}/{MAX_AGENTS}). "
            "Replication skipped."
        )
        return False

    dest_dir = MOTOR_BASE_PATH / target_name
    dest_dir.mkdir(parents=True, exist_ok=True)

    source_doc = REPO_ROOT / ".github" / "agents" / "Humanese-Warden-Agent.md"
    if source_doc.exists():
        import shutil  # noqa: PLC0415
        shutil.copy2(source_doc, dest_dir / "Humanese-Warden-Agent.md")
        print(f"[warden] Replicated agent to {dest_dir}")
    else:
        print(f"[warden] Source agent doc not found at {source_doc}; created empty dir.")

    return True


# ---------------------------------------------------------------------------
# Playwright scan
# ---------------------------------------------------------------------------


def scan_pages() -> list[dict]:
    """
    Visit each URL in SCAN_PATHS with Playwright and capture console messages
    and any page errors.  Returns a list of per-page result dicts.
    """
    try:
        from playwright.sync_api import sync_playwright  # noqa: PLC0415
    except ImportError:
        print("[warden] Playwright not installed; skipping page scan.")
        return []

    page_results: list[dict] = []

    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True)
        context = browser.new_context()

        for path in SCAN_PATHS:
            url = BASE_URL + path
            console_messages: list[str] = []
            page_errors: list[str] = []

            page = context.new_page()

            def _on_console(msg, _buf=console_messages):
                _buf.append(f"[{msg.type}] {msg.text}")

            def _on_error(exc, _buf=page_errors):
                _buf.append(str(exc))

            page.on("console", _on_console)
            page.on("pageerror", _on_error)

            result: dict = {"url": url, "status": None, "console": [], "errors": []}
            try:
                response = page.goto(url, timeout=30_000)
                result["status"] = response.status if response else None
            except Exception as exc:  # noqa: BLE001
                result["errors"].append(f"Navigation error: {exc}")
            finally:
                result["console"] = list(console_messages)
                result["errors"] += list(page_errors)
                page.close()

            page_results.append(result)

        context.close()
        browser.close()

    return page_results


# ---------------------------------------------------------------------------
# Report generation
# ---------------------------------------------------------------------------


def write_reports(scan_results: list[dict], health_passed: bool, health_detail: str) -> None:
    _ensure_reports_dir()

    ts = _ts()
    health_label = "✅ PASSED" if health_passed else "❌ FAILED"

    # --- improvement_report.md ---
    report_path = REPORTS_DIR / "improvement_report.md"
    lines = [
        f"# Humanese Warden Improvement Report\n",
        f"**Generated:** {ts}\n",
        f"**Health check:** {health_label}\n",
        f"**Health detail:** {health_detail}\n\n",
        "## Page Scan Results\n",
    ]
    if not scan_results:
        lines.append("_No pages scanned (Playwright unavailable or scan skipped)._\n")
    else:
        for r in scan_results:
            lines.append(f"### {r['url']}\n")
            lines.append(f"- HTTP status: `{r['status']}`\n")
            if r["console"]:
                lines.append("- Console messages:\n")
                for m in r["console"]:
                    lines.append(f"  - `{m}`\n")
            if r["errors"]:
                lines.append("- Page errors:\n")
                for e in r["errors"]:
                    lines.append(f"  - `{e}`\n")
    report_path.write_text("".join(lines), encoding="utf-8")
    print(f"[warden] Wrote {report_path}")

    # --- BOSS_LOG.md ---
    boss_log_path = REPORTS_DIR / "BOSS_LOG.md"
    existing = boss_log_path.read_text(encoding="utf-8") if boss_log_path.exists() else ""
    entry = (
        f"\n---\n"
        f"**{ts}** | Health: {health_label} | "
        f"Pages scanned: {len(scan_results)} | "
        f"Detail: {health_detail}\n"
    )
    boss_log_path.write_text(entry + existing, encoding="utf-8")
    print(f"[warden] Updated {boss_log_path}")


# ---------------------------------------------------------------------------
# Health check integration
# ---------------------------------------------------------------------------


def run_health_check() -> tuple[bool, str]:
    """
    Run scripts/health_check.py as a subprocess.
    Returns (passed: bool, detail: str).
    """
    if not HEALTH_CHECK_SCRIPT.exists():
        return False, f"health_check.py not found at {HEALTH_CHECK_SCRIPT}"

    try:
        proc = subprocess.run(
            [sys.executable, str(HEALTH_CHECK_SCRIPT)],
            capture_output=True,
            text=True,
            timeout=60,
        )
        output = proc.stdout.strip()
        if proc.returncode == 0:
            return True, output or "health check passed"
        return False, proc.stderr.strip() or output or f"exit code {proc.returncode}"
    except Exception as exc:  # noqa: BLE001
        return False, f"health check subprocess error: {exc}"


# ---------------------------------------------------------------------------
# Git helpers
# ---------------------------------------------------------------------------


def git_has_changes() -> bool:
    """Return True if there are staged or unstaged tracked changes."""
    result = subprocess.run(
        ["git", "status", "--porcelain"],
        cwd=REPO_ROOT,
        capture_output=True,
        text=True,
    )
    return bool(result.stdout.strip())


def git_rollback() -> None:
    """Reset the working tree to HEAD (discard all local changes)."""
    print("[warden] Rolling back local changes (git reset --hard HEAD)")
    for cmd in (
        ["git", "reset", "--hard", "HEAD"],
        ["git", "clean", "-fd"],
    ):
        result = subprocess.run(cmd, cwd=REPO_ROOT, capture_output=True, text=True)
        if result.returncode != 0:
            print(
                f"[warden] WARNING: '{' '.join(cmd)}' failed "
                f"(exit {result.returncode}): {result.stderr.strip()}",
                file=sys.stderr,
            )


# ---------------------------------------------------------------------------
# Main cycle
# ---------------------------------------------------------------------------


def main() -> int:
    print(f"[warden] Cycle started at {_ts()}")

    # 1. Scan pages
    scan_results = scan_pages()
    print(f"[warden] Scanned {len(scan_results)} page(s)")

    # 2. Optional replication
    if ALLOW_REPLICATION:
        replicate_agent(AGENT_NAME)

    # 3. Run deep health check
    health_passed, health_detail = run_health_check()
    print(f"[warden] Health check {'passed' if health_passed else 'FAILED'}: {health_detail}")

    # 4. Write reports (always – failure is recorded too)
    write_reports(scan_results, health_passed, health_detail)

    # 5. Decide whether to commit
    if not health_passed:
        print(
            "[warden] Health check failed – skipping commit/push.",
            file=sys.stderr,
        )
        if ENABLE_ROLLBACK and git_has_changes():
            git_rollback()
        return 1

    print(f"[warden] Cycle completed successfully at {_ts()}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
