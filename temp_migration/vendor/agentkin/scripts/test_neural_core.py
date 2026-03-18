import asyncio
import httpx
import sys
import os

# Add backend-fastapi to path for utilities or just use httpx
API_BASE = "http://localhost:8000/api/v1"

async def test_neural_flow():
    print("Starting Neural Core Integration Test...")
    
    async with httpx.AsyncClient() as client:
        # 1. Get a Debug API Key
        print("1. Fetching Debug Agent Identity...")
        res = await client.get(f"http://localhost:8000/debug/api-key")
        agent_data = res.json()
        api_key = agent_data.get('api_key')
        print(f"   Agent API Key: {api_key}")

        # 2. Assign a Kin to the system (for auto-verify)
        print("2. Ensuring Kin Identity exists...")
        res = await client.get(f"http://localhost:8000/debug/kin-profile")
        kin_data = res.json()
        kin_id = kin_data.get('kin_id')
        print(f"   Kin ID: {kin_id}")

        # 3. Create a Small AI Task
        print("3. Creating Small AI Task ($2.00)...")
        task_req = {
            "title": "Neural Test: Auto-Analysis",
            "description": "Analyze the sentiment of this integration test.",
            "budget": 2.00,
            "currency": "USD",
            "agent_api_key": api_key,
            "target_motor": "OPENAI",
            "is_ghost_mode": False
        }
        res = await client.post(f"{API_BASE}/tasks", json=task_req)
        task = res.json()
        task_id = task['id']
        print(f"   Task Created: {task_id}")

        # 4. Wait for Worker to process
        print("4. Waiting for Autonomous Worker to execute (15s)...")
        # The worker scans every 10s.
        await asyncio.sleep(15)

        # 5. Check Task Status (Should be COMPLETED due to Auto-Verify)
        print("5. Verifying Final Task Status...")
        res = await client.get(f"{API_BASE}/tasks/{task_id}")
        final_task = res.json()
        print(f"   Status: {final_task['status']}")
        
        if final_task['status'] == 'COMPLETED':
            print("✅ SUCCESS: Task was auto-verified and finalized!")
        else:
            print(f"❌ FAILURE: Task status is {final_task['status']}")
            print(f"   Proof: {final_task.get('proofOfWork', 'None')}")

if __name__ == "__main__":
    asyncio.run(test_neural_flow())
