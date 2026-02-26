"""
Humanese Warden Logic
Playwright-based autonomous scanning, reporting, and guarded self-replication.
"""

import os
import shutil
import datetime
import asyncio

from playwright.async_api import async_playwright

# ── environment ──────────────────────────────────────────────────────────────
TARGET_URL = os.environ.get("TARGET_URL", "https://example.com")
ALLOW_REPLICATION = os.environ.get("ALLOW_REPLICATION", "0").strip() == "1"
MOTOR_BASE_PATH = os.path.realpath(
    os.environ.get("MOTOR_BASE_PATH", "/opt/humanese/agents")
)
MAX_AGENTS = int(os.environ.get("MAX_AGENTS", "21"))

# ── paths ─────────────────────────────────────────────────────────────────────
REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REPORTS_DIR = os.path.join(REPO_ROOT, "reports")
LOGS_DIR = os.path.join(REPO_ROOT, "logs")
IMPROVEMENT_REPORT = os.path.join(REPORTS_DIR, "improvement_report.md")
BOSS_LOG = os.path.join(REPORTS_DIR, "BOSS_LOG.md")
SCREENSHOT_PATH = os.path.join(LOGS_DIR, "current_state.png")

# DNA files replicated to child agents
DNA_FILES = [
    os.path.join(REPO_ROOT, "scripts", "warden_logic.py"),
    os.path.join(REPO_ROOT, ".github", "agents", "Humanese-Warden-Agent.md"),
    os.path.join(REPO_ROOT, ".github", "workflows", "warden-cycle.yml"),
]


# ── governor ─────────────────────────────────────────────────────────────────
def check_population() -> int:
    """Return number of agent directories under MOTOR_BASE_PATH."""
    if not os.path.isdir(MOTOR_BASE_PATH):
        return 0
    return sum(
        1
        for entry in os.scandir(MOTOR_BASE_PATH)
        if entry.is_dir()
    )


def replicate_agent(target_name: str) -> bool:
    """
    Copy DNA files into a new sub-directory of MOTOR_BASE_PATH.
    Returns True if replication succeeded, False otherwise.
    Defends against path traversal by verifying the resolved target stays
    within MOTOR_BASE_PATH.
    """
    if not ALLOW_REPLICATION:
        print("[Warden] Replication disabled (ALLOW_REPLICATION != 1).")
        return False

    # Resolve and validate path — block anything that isn't a proper subdirectory
    target_dir = os.path.realpath(os.path.join(MOTOR_BASE_PATH, target_name))
    if not target_dir.startswith(MOTOR_BASE_PATH + os.sep):
        print(f"[Warden] Path traversal blocked: {target_dir!r} is outside motor base.")
        return False

    population = check_population()
    if population >= MAX_AGENTS:
        print(f"[Warden] Population limit reached ({population}/{MAX_AGENTS}). Replication skipped.")
        return False

    os.makedirs(target_dir, exist_ok=True)

    # Copy DNA files
    for src in DNA_FILES:
        if os.path.isfile(src):
            rel = os.path.relpath(src, REPO_ROOT)
            dst = os.path.join(target_dir, rel)
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            shutil.copy2(src, dst)

    # Write start_motor.sh
    start_script = os.path.join(target_dir, "start_motor.sh")
    with open(start_script, "w") as fh:
        fh.write("#!/usr/bin/env bash\n")
        fh.write('set -euo pipefail\n')
        fh.write('python3 "$(dirname "$0")/scripts/warden_logic.py"\n')
    os.chmod(start_script, 0o755)

    print(f"[Warden] Replicated agent to {target_dir!r}.")
    return True


# ── scanning ──────────────────────────────────────────────────────────────────
async def scan() -> dict:
    """Scan TARGET_URL with Playwright and return collected data."""
    console_messages: list[str] = []
    page_errors: list[str] = []

    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        page = await browser.new_page()

        page.on("console", lambda msg: console_messages.append(f"[{msg.type}] {msg.text}"))
        page.on("pageerror", lambda exc: page_errors.append(str(exc)))

        try:
            await page.goto(TARGET_URL, wait_until="networkidle", timeout=30_000)
        except Exception as exc:
            page_errors.append(f"Navigation error: {exc}")

        html_excerpt = (await page.content())[:2000]

        os.makedirs(LOGS_DIR, exist_ok=True)
        await page.screenshot(path=SCREENSHOT_PATH, full_page=False)

        await browser.close()

    return {
        "html_excerpt": html_excerpt,
        "console_messages": console_messages,
        "page_errors": page_errors,
    }


# ── reporting ─────────────────────────────────────────────────────────────────
def write_reports(data: dict) -> None:
    os.makedirs(REPORTS_DIR, exist_ok=True)
    timestamp = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

    # improvement_report.md
    errors_section = (
        "\n".join(f"- `{e}`" for e in data["page_errors"])
        if data["page_errors"]
        else "_None detected._"
    )
    console_section = (
        "\n".join(f"- `{m}`" for m in data["console_messages"][:20])
        if data["console_messages"]
        else "_None._"
    )
    report_entry = (
        f"\n## Warden Scan — {timestamp}\n\n"
        f"**Target:** `{TARGET_URL}`\n\n"
        f"### Page Errors\n{errors_section}\n\n"
        f"### Console Messages (first 20)\n{console_section}\n\n"
        f"### HTML Excerpt\n```html\n{data['html_excerpt'][:500]}\n```\n"
    )
    with open(IMPROVEMENT_REPORT, "a") as fh:
        fh.write(report_entry)

    # BOSS_LOG.md
    error_count = len(data["page_errors"])
    with open(BOSS_LOG, "a") as fh:
        fh.write(f"| {timestamp} | {TARGET_URL} | errors={error_count} |\n")

    print(f"[Warden] Reports written at {timestamp}.")


# ── main ──────────────────────────────────────────────────────────────────────
async def main() -> None:
    print(f"[Warden] Starting scan of {TARGET_URL!r} …")
    data = await scan()
    write_reports(data)
    print("[Warden] Scan complete.")


if __name__ == "__main__":
    asyncio.run(main())
