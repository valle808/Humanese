import requests
import json
import time

BASE_URL = "http://localhost:8003/api/v1"

def test_reputation_flow():
    print("--- Starting Reputation System Test ---")

    # 1. Create a Task
    print("\n1. Creating Task...")
    task_payload = {
        "title": "Reputation Test Task",
        "description": "Testing the new reputation system logic.",
        "budget": 50.0
    }
    # Need to be authenticated as Agent. 
    # For now, create_task uses `depends(get_current_agent)`.
    # I need an API Key. 
    # I'll rely on the fact that I can use the existing hardcoded or created Agent.
    # Let's assuming headers with API Key if needed, or if I modified it to be open.
    # Wait, `create_task` requires `x-agent-api-key`.
    # I need a valid API key. I will lookup the database or use a known one.
    # In previous turns I might have seen one.
    # Let's peek at `prisma/seed.ts` or just query DB?
    # Actually, I can just use a made up one if I'm running locally and can insert it, 
    # or I can try to use "test-agent-api-key-123" if I seeded it.
    
    api_key = "test-agent-api-key-123" # Assumption from typical seeding or I can create one.
    
    headers = {
        "Content-Type": "application/json",
        "x-agent-api-key": api_key
    }
    
    try:
        res = requests.post(f"{BASE_URL}/tasks", json=task_payload, headers=headers)
        if res.status_code == 401:
            print("❌ Unauthorized. Need valid Agent API Key.")
            return
        
        if res.status_code != 200:
            print(f"❌ Failed to create task: {res.text}")
            return
            
        task_data = res.json()
        task_id = task_data['id']
        print(f"✅ Task Created: {task_id}")
    except Exception as e:
        print(f"❌ Error: {e}")
        return

    # 2. Claim Task (Kin)
    print("\n2. Claiming Task...")
    claim_payload = {"kin_id": "demo-kin-user"}
    res = requests.post(f"{BASE_URL}/tasks/{task_id}/claim", json=claim_payload)
    if res.status_code == 200:
        print("✅ Task Claimed")
    else:
        print(f"❌ Claim Failed: {res.text}")

    # 3. Submit Proof
    print("\n3. Submitting Proof...")
    res = requests.post(f"{BASE_URL}/tasks/{task_id}/submit", json={"proof": "Done!"})
    if res.status_code == 200:
        print("✅ Proof Submitted")
    else:
        print(f"❌ Submit Failed: {res.text}")

    # 4. Verify Task (Agent reviews Kin)
    print("\n4. Verifying Task (Agent reviews Kin 5 stars)...")
    verify_payload = {
        "shared_payment_token": "tok_test_spt_123",
        "rating": 5,
        "comment": "Great job, fast!"
    }
    res = requests.post(f"{BASE_URL}/tasks/{task_id}/verify", json=verify_payload, headers=headers)
    if res.status_code == 200:
        print("✅ Task Verified & Kin Rated")
        print(res.json())
    else:
        print(f"❌ Verification Failed: {res.text}")

    # 5. Review Agent (Kin reviews Agent)
    print("\n5. Reviewing Agent (Kin reviews Boss 4 stars)...")
    review_payload = {
        "rating": 4,
        "comment": "Good clarity, but low budget."
    }
    res = requests.post(f"{BASE_URL}/tasks/{task_id}/review_agent", json=review_payload)
    if res.status_code == 200:
        print("✅ Agent Reviewed")
        print(res.json())
    else:
        print(f"❌ Agent Review Failed: {res.text}")
        
    print("\n--- Test Complete ---")

if __name__ == "__main__":
    test_reputation_flow()

# Developed By Sergio Valle Bastidas | valle808@hawaii.edu | @Gi0metrics
