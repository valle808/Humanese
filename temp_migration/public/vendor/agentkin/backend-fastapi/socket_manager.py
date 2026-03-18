import socketio
import asyncio
import datetime

# Create a Socket.IO server within FastAPI
sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins=['http://localhost:3000', 'http://127.0.0.1:3000', '*'] 
)

# Ephemeral Store for Ghost Sessions (No Logs)
ghost_sessions = {}

@sio.event
async def connect(sid, environ):
    print(f"Client connected: {sid}")

@sio.event
async def disconnect(sid):
    print(f"Client disconnected: {sid}")
    # Cleanup ghost sessions if participant disconnects
    to_remove = [k for k, v in ghost_sessions.items() if sid in v['participants']]
    for k in to_remove:
        del ghost_sessions[k]
        print(f"Ghost Session {k} terminated due to disconnect.")

# Helper to emit events easily from other modules
async def emit_new_task(task_data):
    await sio.emit('new_task', task_data)

async def emit_task_updated(task_data):
    """
    Emits 'task_updated' event. 
    Frontend should listen to this to update state of specific task.
    """
    await sio.emit('task_updated', task_data)

# Ghost Mode Signaling (Ephemeral)
@sio.event
async def ghost_session_start(sid, data):
    """
    Initiates a Ghost Session.
    data: { 'taskId': str, 'publicKey': str }
    """
    task_id = data.get('taskId')
    if task_id:
        ghost_sessions[task_id] = {
            'participants': {sid},
            'keys': [data.get('publicKey')]
        }
        await sio.emit('ghost_session_ready', {'taskId': task_id}, room=sid)
        print(f"Ghost Session Started: {task_id}")

@sio.event
async def ghost_task_complete(sid, data):
    """
    Triggers Memory Wipe upon Task Completion.
    data: { 'taskId': str }
    """
    task_id = data.get('taskId')
    if task_id in ghost_sessions:
        # Cryptographic Wipe Simulation
        del ghost_sessions[task_id]
        
        # Notify all clients that session is purged
        await sio.emit('session_wiped', {'taskId': task_id, 'status': 'MEM_WIPE_SUCCESS'})
        print(f"Ghost Session {task_id} WIPED from memory.")

async def broadcast_log(log_data):
    """
    Broadcasts a log message to all connected clients.
    log_data: { 'message': str, 'source': str, 'level': str, 'timestamp': str }
    """
    await sio.emit('agent_log', log_data)

async def emit_log(message: str, level: str = "INFO", source: str = "System"):
    """
    Helper to emit logs with timestamp (Compatibility Wrapper)
    """
    await sio.emit('agent_log', {
        'message': message,
        'level': level,
        'source': source,
        'timestamp': datetime.datetime.now().isoformat()
    })

async def emit_remote_command(command: dict):
    """
    Broadcasts a remote command to all connected clients.
    command: { 'action': str, 'target': Optional[str], 'value': Optional[Any] }
    """
    await sio.emit('remote_command', command)

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
