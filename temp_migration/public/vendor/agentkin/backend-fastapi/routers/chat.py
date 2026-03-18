from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
from utils.neural_engine import NeuralEngine
from prisma_db import db
import uuid

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    userId: Optional[str] = "anonymous"

class ChatResponse(BaseModel):
    response: str
    command: Optional[dict] = None

async def ensure_virtual_users():
    """Ensures the neural-assistant and other virtual users exist in the DB."""
    assistant_id = "neural-assistant"
    anon_id = "anonymous"
    
    # Check Assistant
    assistant = await db.user.find_unique(where={'id': assistant_id})
    if not assistant:
        await db.user.create(data={
            'id': assistant_id,
            'email': 'assistant@agentkin.ai',
            'name': 'Neural Assistant',
            'role': 'ADMIN'
        })
        
    # Check Anonymous (Global Pool for Help)
    anon = await db.user.find_unique(where={'id': anon_id})
    if not anon:
        await db.user.create(data={
            'id': anon_id,
            'email': 'anonymous@agentkin.ai',
            'name': 'Guest User',
            'role': 'KIN'
        })

@router.post("/chat", response_model=ChatResponse)
async def chat_with_assistant(request: ChatRequest):
    await ensure_virtual_users()
    try:
        # 1. Fetch History from DB (Infinity Memory)
        # For "anonymous", we could use a session ID, but let's assume a simplified persistent pool for now.
        history_records = await db.message.find_many(
            where={
                'OR': [
                    {'fromId': request.userId},
                    {'toId': request.userId}
                ]
            },
            order={'createdAt': 'asc'},
            take=20 # Last 20 messages for context
        )
        
        history = []
        for rec in history_records:
            role = "user" if rec.fromId == request.userId else "assistant"
            history.append({"role": role, "content": rec.content})

        # 2. Process with Neural Engine
        result = await NeuralEngine.process_message(request.message, history)

        # 3. Persist Messages (Infinity Memory)
        # Create User message
        await db.message.create(
            data={
                'content': request.message,
                'fromId': request.userId,
                'toId': 'neural-assistant'
            }
        )
        # Create Assistant message
        await db.message.create(
            data={
                'content': result['response'],
                'fromId': 'neural-assistant',
                'toId': request.userId
            }
        )

        return ChatResponse(
            response=result['response'],
            command=result['command']
        )
    except Exception as e:
        print(f"Chat Router Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
