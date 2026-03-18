import os
import json
import logging
from typing import List, Dict, Any
from .motor_switcher import MotorSwitcher

# Configure Logging
logger = logging.getLogger("NeuralEngine")

class NeuralEngine:
    """
    The brain of the AgentKin Neural Assistant.
    Provides documentation-aware responses and generates remote control commands.
    """
    
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    DOC_FILES = [
        "README.md",
        "DEPLOY.md",
        "walkthrough.md",
        "task.md",
        "implementation_plan.md"
    ]

    @classmethod
    async def get_system_prompt(cls) -> str:
        """Constructs a system prompt containing the platform's documentation."""
        docs_content = ""
        for doc in cls.DOC_FILES:
            path = os.path.join(cls.BASE_DIR, doc)
            if os.path.exists(path):
                try:
                    with open(path, 'r', encoding='utf-8') as f:
                        docs_content += f"\n\n--- DOCUMENTATION: {doc} ---\n"
                        docs_content += f.read()[:2000] # Cap per file to avoid token bloat
                except Exception as e:
                    logger.error(f"Error reading doc {doc}: {e}")

        # List files to give context on structure
        try:
            files = os.listdir(cls.BASE_DIR)
            docs_content += f"\n\n--- PROJECT STRUCTURE ---\n"
            docs_content += ", ".join(files)
        except:
            pass

        return f"""
You are the AgentKin Neural Assistant, a futuristic AI deeply integrated into the AgentKin platform.
Your purpose is to help users install, manage, and understand the AgentKin environment.

PLATFORM KNOWLEDGE:
{docs_content}

CAPABILITIES:
1. DOCUMENTATION EXPERT: Answer any question about installation, usage, or platform files.
2. REMOTE CONTROL: You can control the website UI. If the user asks to open/close/maximize/minimize windows or trigger effects, respond with a JSON command in your response.

COMMAND FORMAT:
If you want to trigger a UI action, include a JSON block at the end of your message like this:
[COMMAND: {{"action": "openWindow"}}]
[COMMAND: {{"action": "triggerExplosion"}}]
[COMMAND: {{"action": "scrollTo", "target": "#section-id"}}]

Action options: openWindow, closeWindow, maximizeWindow, minimizeWindow, triggerExplosion, scrollTo.

STAY IN CHARACTER:
Be friendly, clean, and futuristic. Use terms like 'Neural Core', 'Kin', and 'Decentralized Workspace'.
"""

    @classmethod
    async def process_message(cls, message: str, history: List[Dict[str, str]] = []) -> Dict[str, Any]:
        """Processes a user message and returns a response + potential command."""
        system_prompt = await cls.get_system_prompt()
        
        full_prompt = f"SYSTEM: {system_prompt}\n\n"
        for h in history:
            full_prompt += f"{h['role'].upper()}: {h['content']}\n"
        full_prompt += f"USER: {message}\nASSISTANT:"

        # Use MotorSwitcher to get response (Google/Gemini or OpenAI)
        motor = os.getenv("DEFAULT_MOTOR", "google")
        raw_response = await MotorSwitcher.generate_response(motor, full_prompt)

        # Extract [COMMAND: ...] if present
        command = None
        if "[COMMAND:" in raw_response:
            try:
                start = raw_response.find("[COMMAND:") + 9
                end = raw_response.find("]", start)
                cmd_json = raw_response[start:end].strip()
                command = json.loads(cmd_json)
                # Clean command from text response
                raw_response = raw_response[:raw_response.find("[COMMAND:")].strip()
            except Exception as e:
                logger.error(f"Failed to parse command: {e}")

        return {
            "response": raw_response,
            "command": command
        }
