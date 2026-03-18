from dotenv import load_dotenv
import os, sys

# Ensure backend dir is in path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

load_dotenv(dotenv_path="../.env")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from prisma_db import connect_db, disconnect_db
from routers import tasks, payments, solana, system, auth, chat, bridge, blog

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Connect DB on startup
    await connect_db()
    yield
    # Disconnect DB on shutdown
    await disconnect_db()

# Create FastAPI instance
app = FastAPI(title="AgentKin Backend", version="1.0.0", lifespan=lifespan)

# Mount Socket.IO
import socketio
from socket_manager import sio
app.mount("/socket.io", socketio.ASGIApp(sio))

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(tasks.router, prefix="/api/v1", tags=["Tasks"])
app.include_router(payments.router, prefix="/api/v1", tags=["Payments"])
app.include_router(solana.router, prefix="/api/v1", tags=["Solana"])
app.include_router(system.router, prefix="/api/v1", tags=["System"])
app.include_router(auth.router, prefix="/api/v1", tags=["Auth"])
app.include_router(chat.router, prefix="/api/v1", tags=["Chat"])
app.include_router(bridge.router, prefix="/api/v1", tags=["Bridge"])
app.include_router(blog.router, prefix="/api/v1", tags=["Blog"])

@app.get("/")
async def root():
    return {"message": "AgentKin Engine Running"}

@app.get("/debug/api-key")
async def debug_api_key():
    from prisma_db import db
    agent = await db.agentprofile.find_first()
    if agent:
        return {"api_key": agent.API_Key, "agent_id": agent.id}
    # Create one if missing
    try:
        user = await db.user.create(
            data={
                'email': 'debug_agent@example.com',
                'role': 'ADMIN'
            }
        )
        agent = await db.agentprofile.create(
            data={
                'userId': user.id,
                'API_Key': 'debug-key-456',
                'agentName': 'Debug Agent'
            }
        )
        return {"api_key": agent.API_Key, "agent_id": agent.id}
    except Exception as e:
        return {"error": str(e), "note": "likely already exists or specific error"}

@app.get("/debug/kin-profile")
async def debug_kin_profile():
    from prisma_db import db
    # specific ID for auto worker
    worker_email = "auto_worker@example.com"
    
    user = await db.user.find_unique(where={'email': worker_email})
    if not user:
        user = await db.user.create(
            data={
                'email': worker_email,
                'name': 'Auto Worker',
                'role': 'KIN'
            }
        )
    
    kin = await db.kinprofile.find_unique(where={'userId': user.id})
    if not kin:
        kin = await db.kinprofile.create(
            data={
                'userId': user.id,
                'skills': 'Automation, Python',
                'rating': 5.0
            }
        )
    return {"kin_id": kin.id}

@app.get("/metrics")
async def get_system_metrics():
    from prisma_db import db
    try:
        tasks_open = await db.kintask.count(where={'status': 'OPEN'})
        tasks_total = await db.kintask.count()
        agents_count = await db.agentprofile.count()
        return {
            "tasks_open": tasks_open,
            "tasks_total": tasks_total,
            "agents": agents_count,
            "uptime": "99.9%"
        }
    except Exception as e:
        print(f"Metrics Error: {e}")
        return {"tasks_open": 0, "tasks_total": 0, "agents": 0, "uptime": "N/A"}

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
