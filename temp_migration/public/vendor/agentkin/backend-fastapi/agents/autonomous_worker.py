import asyncio
import sys
import os

# Ensure backend-fastapi is in path to import prisma_db and utils
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from prisma_db import connect_db, disconnect_db, db
from utils.motor_switcher import MotorSwitcher
from core.config import settings

async def run_worker():
    print("🤖 AgentKin Autonomous Worker Starting...")
    await connect_db()
    from socket_manager import emit_log
    await emit_log("Neural Engine: ONLINE", "SUCCESS", "Worker")
    
    try:
        while True:
            # print("Scanning for OPEN tasks...")
            
            # Find tasks that are OPEN and have a targetMotor set
            tasks = await db.kintask.find_many(
                where={
                    'status': 'OPEN',
                    'targetMotor': {'not': None}
                },
                take=1
            )
            
            if not tasks:
                # print("No tasks found. Sleeping 10s...")
                await asyncio.sleep(10)
                continue
                
            task = tasks[0]
            msg = f"Neural Scan: Found Task [{task.id}] - {task.title}"
            print(msg)
            await emit_log(msg, "INFO", "Scan")
            
            # Update to CLAIMED -> IN_PROGRESS
            await db.kintask.update(
                where={'id': task.id},
                data={'status': 'IN_PROGRESS'}
            )
            await emit_log(f"Identity Lock: Task {task.id} set to IN_PROGRESS", "INFO", "Logic")
            
            # Simulate "Thinking" time
            await emit_log(f"Neural Core: Initializing {task.targetMotor} for prompt digestion...", "INFO", "Motor")
            await asyncio.sleep(2)
            
            # Execute Work
            try:
                result = await MotorSwitcher.generate_response(
                    target_motor=task.targetMotor,
                    prompt=f"Task: {task.title}\nDetails: {task.description}"
                )
                
                # Update Task to IN_REVIEW (Submit Proof) via Logic Helper
                # In a real distributed app, this would be an HTTP call. 
                # Here we import and call the logic to trigger Side-Effects (Auto-Verify, Sockets)
                from routers.tasks import submit_proof, SubmitProofRequest
                from fastapi import BackgroundTasks
                
                # We mock BackgroundTasks to trigger it immediately or just add to it
                bg = BackgroundTasks()
                await submit_proof(task.id, SubmitProofRequest(proof=result), bg)
                
                # Manually run bg tasks if not in a real FastAPI request context
                for t in bg.tasks:
                    if asyncio.iscoroutinefunction(t.func):
                         await t.func(*t.args, **t.kwargs)
                    else:
                         t.func(*t.args, **t.kwargs)

                await emit_log(f"Neural Pulse: Task {task.id} execution SUCCESS. Proof submitted & Auto-Verified.", "SUCCESS", "Worker")
                
            except Exception as e:
                err_msg = f"Neural Synapse Failure: {str(e)}"
                print(err_msg)
                await emit_log(err_msg, "ERROR", "Worker")
                # Mark as OPEN again
                await db.kintask.update(
                    where={'id': task.id},
                    data={'status': 'OPEN'} 
                )
            
            await asyncio.sleep(2)
            
    except KeyboardInterrupt:
        print("Stopping Worker...")
    finally:
        await disconnect_db()

if __name__ == "__main__":
    asyncio.run(run_worker())

# Developed By Sergio Valle Bastidas | valle808@hawaii.edu | @Gi0metrics
