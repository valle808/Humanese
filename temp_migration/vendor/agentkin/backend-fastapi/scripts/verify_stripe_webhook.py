
import sys
import os
import requests
import asyncio
import time

# Add parent dir to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from prisma_db import connect_db, disconnect_db, db

async def verify():
    print("Connecting to DB...")
    await connect_db()

    # 1. Create Test User
    user_id = "test_user_verify_webhook"
    email = "test_verify@example.com"
    connect_id = "acct_test_12345"

    # Cleanup potential previous run
    try:
        exist = await db.user.find_unique(where={'email': email})
        if exist:
            # Try to delete user, might cascade
            # But let's delete profile first to be safe
            await db.kinprofile.delete_many(where={'userId': exist.id})
            await db.user.delete(where={'id': exist.id})
    except Exception as e:
        print(f"Cleanup warning: {e}")

    print("Creating User...")
    user = await db.user.create(
        data={
            'id': user_id,
            'email': email,
            'role': 'KIN'
        }
    )

    print("Creating KinProfile...")
    kin = await db.kinprofile.create(
        data={
            'userId': user.id,
            'stripeConnectAccountId': connect_id,
            'stripeDetailsSubmitted': False
        }
    )

    # 2. Send Webhook
    payload_data = {
        "type": "account.updated",
        "data": {
            "object": {
                "id": connect_id,
                "details_submitted": True
            }
        }
    }
    
    # Needs to be string for signature
    import json
    import time
    import hmac
    import hashlib
    
    payload_str = json.dumps(payload_data)
    secret = "whsec_placeholder" # From .env
    timestamp = int(time.time())
    
    signed_payload = f"{timestamp}.{payload_str}"
    signature = hmac.new(
        key=secret.encode('utf-8'),
        msg=signed_payload.encode('utf-8'),
        digestmod=hashlib.sha256
    ).hexdigest()
    
    headers = {
        "Stripe-Signature": f"t={timestamp},v1={signature}",
        "Content-Type": "application/json"
    }
    
    # Assuming backend is running on 8000
    url = "http://localhost:8000/api/v1/payments/webhook"
    print(f"Sending Webhook to {url}...")
    try:
        # Use data=payload_str to ensure body matches signature
        res = requests.post(url, data=payload_str, headers=headers, timeout=5)
        print(f"Response: {res.status_code} {res.text}")
    except Exception as e:
        print(f"Webhook Request Failed: {e}")
        print("Ensure the backend server is running on localhost:8000")

    # 3. Verify DB Update
    print("Checking DB...")
    await asyncio.sleep(2) # Wait for processing
    
    updated_kin = await db.kinprofile.find_unique(where={'id': kin.id})
    
    if updated_kin and updated_kin.stripeDetailsSubmitted:
        print("SUCCESS: stripeDetailsSubmitted is True!")
    else:
        print(f"FAILURE: stripeDetailsSubmitted is {updated_kin.stripeDetailsSubmitted if updated_kin else 'None'}.")

    # Cleanup
    try:
        await db.kinprofile.delete(where={'id': kin.id})
        await db.user.delete(where={'id': user_id})
    except Exception as e:
        print(f"Final cleanup warning: {e}")
        
    await disconnect_db()

if __name__ == "__main__":
    asyncio.run(verify())
