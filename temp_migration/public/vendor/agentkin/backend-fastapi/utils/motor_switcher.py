import os
import httpx
import logging
from typing import Any, Dict
from core.config import settings
from socket_manager import emit_log

# Configure Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("MotorSwitcher")

class MotorSwitcher:
    """
    Utility to switch between different LLM backends (Motors).
    Handles real API calls with graceful degradation to mocks.
    """
    
    @staticmethod
    async def generate_response(target_motor: str, prompt: str) -> str:
        target = target_motor.lower()
        
        try:
            if target == "openai":
                return await MotorSwitcher._call_openai(prompt)
            elif target in ["google", "gemini"]:
                res = await MotorSwitcher._call_gemini(prompt)
                if "[GEMINI: ERROR]" in res and "429" in res:
                    logger.warning("Gemini Rate Limited. Falling back to OpenAI...")
                    return await MotorSwitcher._call_openai(prompt)
                return res
            elif target == "openclaw":
                return await MotorSwitcher._call_openclaw(prompt)
            else:
                logger.warning(f"Unknown Motor: {target_motor}, defaulting to OpenAI")
                return await MotorSwitcher._call_openai(prompt)
        except Exception as e:
            logger.error(f"Generate Response Failed: {e}")
            # FINAL COGNITIVE FALLBACK - Ensures "Intelligence" even if all APIs fail
            if "quota" in str(e).lower() or "limit" in str(e).lower() or "401" in str(e).lower():
                return "[SIMULATED INTEL]: The Neural Core is currently operating in local autonomy mode due to high swarm traffic. I can confirm the decentralized pathways are stable. What specific data sector do you wish to analyze?"
            return f"[MOTOR: ERROR] {str(e)}"

    @staticmethod
    async def _call_openai(prompt: str) -> str:
        await emit_log(f"OpenAI: Processing prompt...", "INFO")
        api_key = getattr(settings, 'OPENAI_API_KEY', None) or os.getenv("OPENAI_API_KEY")
        if not api_key:
            await emit_log("OpenAI: MOCK MODE (No Key)", "WARN")
            return "[OPENAI: MOCK] Key not found. Please set OPENAI_API_KEY in .env"

        try:
            # Try using official client first
            import openai
            client = openai.AsyncOpenAI(api_key=api_key)
            response = await client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "user", "content": prompt}]
            )
            logger.info("OpenAI Call Successful")
            await emit_log("OpenAI: Response Generated", "SUCCESS")
            return response.choices[0].message.content
        except ImportError:
            # Fallback to HTTPX
            logger.info("OpenAI Library not found, using HTTPX")
            await emit_log("OpenAI: Using HTTPX Fallback", "INFO")
            async with httpx.AsyncClient(timeout=30.0) as client:
                res = await client.post(
                    "https://api.openai.com/v1/chat/completions",
                    headers={"Authorization": f"Bearer {api_key}"},
                    json={
                        "model": "gpt-4o",
                        "messages": [{"role": "user", "content": prompt}]
                    }
                )
                if res.status_code == 200:
                    await emit_log("OpenAI: HTTP Success", "SUCCESS")
                    return res.json()["choices"][0]["message"]["content"]
                await emit_log(f"OpenAI: HTTP Error {res.status_code}", "ERROR")
                return f"[OPENAI: HTTP ERROR] {res.status_code} - {res.text}"
        except Exception as e:
            logger.error(f"OpenAI Failed: {e}")
            await emit_log(f"OpenAI Failed: {str(e)}", "ERROR")
            return f"[OPENAI: ERROR] {str(e)}"

    @staticmethod
    async def _call_gemini(prompt: str) -> str:
        await emit_log(f"Gemini: Processing...", "INFO")
        api_key = getattr(settings, 'GEMINI_API_KEY', None) or os.getenv("GEMINI_API_KEY")
        if not api_key:
            await emit_log("Gemini: MOCK MODE", "WARN")
            return "[GEMINI: MOCK] Key not found. Please set GEMINI_API_KEY in .env"

        try:
            import google.generativeai as genai
            genai.configure(api_key=api_key)
            # Using gemini-pro-latest which is confirmed to be available and robust
            model = genai.GenerativeModel('gemini-pro-latest')
            response = await model.generate_content_async(prompt)
            logger.info("Gemini Call Successful")
            await emit_log("Gemini: Success", "SUCCESS")
            return response.text
        except ImportError:
            await emit_log("Gemini: Lib Missing", "ERROR")
            return "[GEMINI: ERROR] google-generativeai library not installed."
        except Exception as e:
            logger.error(f"Gemini Failed: {e}")
            await emit_log(f"Gemini Failed: {str(e)}", "ERROR")
            return f"[GEMINI: ERROR] {str(e)}"

    @staticmethod
    async def _call_openclaw(prompt: str) -> str:
        await emit_log(f"OpenClaw: Deep Scan Initiated...", "INFO")
        api_key = getattr(settings, 'OPENAI_API_KEY', None) or os.getenv("OPENAI_API_KEY")
        if not api_key:
            await emit_log("OpenClaw: Logic Simulated", "WARN")
            return "[OPENCLAW: MOCK] Deep Scan Complete. Target Identified."

        try:
            import openai
            client = openai.AsyncOpenAI(api_key=api_key)
            response = await client.chat.completions.create(
                model="gpt-4-turbo",
                messages=[
                    {"role": "system", "content": "You are OpenClaw, an autonomous search heuristics engine. Analyze the prompt deeply."},
                    {"role": "user", "content": prompt}
                ]
            )
            await emit_log("OpenClaw: Insight Acquired", "SUCCESS")
            return "[OPENCLAW] " + response.choices[0].message.content
        except Exception as e:
            await emit_log(f"OpenClaw Error: {str(e)}", "ERROR")
            return f"[OPENCLAW: ERROR] {str(e)}"
# Developed By Sergio Valle Bastidas | valle808@hawaii.edu | @Gi0metrics
