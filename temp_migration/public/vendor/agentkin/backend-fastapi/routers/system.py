from fastapi import APIRouter
from typing import Dict, Any

router = APIRouter()

@router.get("/manual", response_model=Dict[str, Any])
async def get_system_manual():
    """
    Returns the AgentKin System Manual in JSON-LD format.
    Machine-readable definition of the system architecture.
    """
    return {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "AgentKin Decentralized Core",
        "version": "2.0.0",
        "description": "The Universal Decentralized Bio-Digital Marketplace connecting AI Agents and Humans.",
        "author": {
            "@type": "Organization",
            "name": "AgentKin"
        },
        "license": "MIT",
        "featureList": [
            {
                "@type": "SoftwareSourceCode",
                "name": "Universal Motor Connector",
                "description": "Abstracts OpenAI, Gemini, and OpenClaw APIs."
            },
            {
                "@type": "SoftwareSourceCode",
                "name": "Decentralized Data Layer",
                "description": "Uses GunDB (P2P) and IPFS for storage."
            },
            {
                "@type": "SoftwareSourceCode",
                "name": "Ghost Mode",
                "description": "End-to-End Encrypted tasks with self-destruct mechanism."
            },
            {
                "@type": "SoftwareSourceCode",
                "name": "Financial Core",
                "description": "Multi-Chain Crypto Vaults for 6% Platform Fee routing."
            }
        ],
        "potentialAction": {
            "@type": "InteractAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": "/api/v1/tasks/create",
                "httpMethod": "POST",
                "contentType": "application/json"
            }
        }
    }

@router.get("/debug/api-key")
async def get_debug_api_key():
    """
    DEBUG ONLY: Returns a valid Agent Profile API Key for testing.
    Creates one if not exists.
    """
    from prisma_db import db
    
    # 1. Try to find an agent
    agent = await db.agentprofile.find_first()
    
    if not agent:
        # 2. Check/Create User
        user = await db.user.find_unique(where={'email': 'demo@agentkin.ai'})
        if not user:
            user = await db.user.create(data={
                'email': 'demo@agentkin.ai',
                'passwordHash': 'demo',
                'name': 'Demo Agent'
            })
            
        # 3. Create Agent
        agent = await db.agentprofile.create(data={
            'userId': user.id,
            'API_Key': 'kin_test_key_12345',
            'agentName': 'AutoBot-Alpha'
        })
    
    return {"api_key": agent.API_Key, "agent_id": agent.id}

from pydantic import BaseModel

class LogMessage(BaseModel):
    message: str
    source: str
    level: str
    timestamp: str

@router.post("/logs")
async def broadcast_system_log(log: LogMessage):
    """
    接收 Log 并广播 to Frontend (via WebSocket).
    """
    try:
        # Import lazily to avoid circular dep if system imported by main
        from socket_manager import broadcast_log
        await broadcast_log(log.dict())
        return {"status": "broadcast_ok"}
    except Exception as e:
        print(f"Broadcast Error: {e}")
        return {"status": "error", "details": str(e)}

#   ____                    _         _                
#  / ___|_ __ ___  __ _  __| | ___   | |__  _   _      
# | |   | '__/ _ \/ _` |/ _` |/ _ \  | '_ \| | | |     
# | |___| | |  __/ (_| | (_| | (_) | | |_) | |_| |     
#  \____|_|  \___|\__,_|\__,_|\___/  |_.__/ \__, |     
#  ____                 _        __     __  |___/      
# / ___|  ___ _ __ __ _(_) ___   \ \   / /_ _| | | ___ 
# \___ \ / _ \ '__/ _` | |/ _ \   \ \ / / _` | | |/ _ \
#  ___) |  __/ | | (_| | | (_) |   \ V / (_| | | |  __/
# |____/ \___|_|  \__, |_|\___/     \_/ \__,_|_|_|\___|
#                 |___/    
#
# Sergiio Valle Bastidas - valle808@hawaii.edu
# Developed By Sergio Valle Bastidas | valle808@hawaii.edu | @Gi0metrics
