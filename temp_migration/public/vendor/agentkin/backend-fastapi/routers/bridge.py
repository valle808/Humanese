from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
from typing import Optional
from utils.neural_engine import NeuralEngine
from prisma_db import db
from socket_manager import emit_remote_command, emit_log
import logging

router = APIRouter()
logger = logging.getLogger("Bridge")

class MessagingPayload(BaseModel):
    platform: str # "telegram", "whatsapp"
    sender_id: str
    text: str

@router.post("/webhook")
async def universal_webhook(payload: MessagingPayload):
    """
    Universal webhook for Telegram, WhatsApp, and other platforms.
    Simulates receiving a message and processing it via the Neural Core.
    """
    try:
        await emit_log(f"Incoming {payload.platform} message from {payload.sender_id}", "INFO", "Bridge")
        
        # 1. Fetch History from DB (sender_id as virtual user)
        history_records = await db.message.find_many(
            where={
                'OR': [
                    {'fromId': payload.sender_id},
                    {'toId': payload.sender_id}
                ]
            },
            order={'createdAt': 'asc'},
            take=10
        )
        history = [{"role": ("user" if r.fromId == payload.sender_id else "assistant"), "content": r.content} for r in history_records]
        
        # 2. Process with Neural Engine
        result = await NeuralEngine.process_message(payload.text, history)
        
        # 3. Persist Messages
        await db.message.create(data={'content': payload.text, 'fromId': payload.sender_id, 'toId': 'neural-assistant'})
        await db.message.create(data={'content': result['response'], 'fromId': 'neural-assistant', 'toId': payload.sender_id})

        # 4. If a command was generated, broadcast it to the browser
        if result['command']:
            await emit_remote_command(result['command'])
            await emit_log(f"Executed Remote Command: {result['command']['action']}", "SUCCESS", "Bridge")
        
        return {
            "status": "processed",
            "reply": result['response'],
            "command_executed": bool(result['command'])
        }
    except Exception as e:
        logger.error(f"Bridge Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/test-remote")
async def test_remote_control(action: str = "triggerExplosion"):
    """Debug endpoint to test remote control broadcast."""
    await emit_remote_command({"action": action})
    return {"status": "command_sent", "action": action}
