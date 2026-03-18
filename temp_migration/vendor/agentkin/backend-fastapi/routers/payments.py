from fastapi import APIRouter, HTTPException, Request, BackgroundTasks
from pydantic import BaseModel
from prisma_db import db
import stripe
import os

stripe.api_key = os.environ.get("STRIPE_SECRET_KEY")

router = APIRouter()

class OnboardRequest(BaseModel):
    user_id: str # Simulated Auth for now

@router.post("/payments/onboard")
async def onboard_user(request: OnboardRequest):
    """
    Generate a Stripe Connect Onboarding Link for a Kin User.
    """
    if not stripe.api_key:
         raise HTTPException(status_code=500, detail="Stripe API Key not configured")

    # 1. Fetch User & KinProfile
    # In real app, we use request.user.id from JWT
    user = await db.user.find_unique(
        where={'id': request.user_id},
        include={'kinProfile': True}
    )
    
    if not user:
        # Create user if demo
        if request.user_id.startswith("demo"):
             user = await db.user.create(
                 data={
                     'id': request.user_id,
                     'email': f"{request.user_id}@example.com",
                     'role': 'KIN'
                 }
             )
             # Create KinProfile
             await db.kinprofile.create(
                 data={
                     'userId': user.id,
                     'skills': ['General'],
                     'rating': 0
                 }
             )
             # Re-fetch
             user = await db.user.find_unique(where={'id': request.user_id}, include={'kinProfile': True})
        else:
            raise HTTPException(status_code=404, detail="User not found")

    kin = user.kinProfile
    if not kin:
         # Create profile if missing
         kin = await db.kinprofile.create(
             data={
                 'userId': user.id,
                 'skills': ['General'],
                 'rating': 0
             }
         )

    # 2. Check for existing Stripe Account
    account_id = kin.stripeConnectAccountId
    
    if not account_id:
        try:
            # Create Express Account
            account = stripe.Account.create(
                type="express",
                country="US", # Default to US for demo
                email=user.email,
                capabilities={
                  "card_payments": {"requested": True},
                  "transfers": {"requested": True},
                },
            )
            account_id = account.id
            
            # Save to DB
            await db.kinprofile.update(
                where={'id': kin.id},
                data={'stripeConnectAccountId': account_id}
            )
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Stripe Account Creation Failed: {str(e)}")

    # 3. Create Account Link
    try:
        account_link = stripe.AccountLink.create(
            account=account_id,
            refresh_url="http://localhost:3000/finance?refresh=true",
            return_url="http://localhost:3000/finance?success=true",
            type="account_onboarding",
        )
        
        return {"url": account_link.url}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Stripe Link Creation Failed: {str(e)}")

@router.get("/payments/status")
async def get_payment_status(user_id: str):
    # Simulated User ID query param for now
    user = await db.user.find_unique(
        where={'id': user_id},
        include={'kinProfile': True}
    )
    if not user or not user.kinProfile:
        return {"connected": False}
    
    return {
        "connected": bool(user.kinProfile.stripeConnectAccountId),
        "account_id": user.kinProfile.stripeConnectAccountId
    }

@router.post("/payments/webhook")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    endpoint_secret = os.environ.get("STRIPE_WEBHOOK_SECRET") # We need to set this

    event = None

    try:
        if endpoint_secret:
            event = stripe.Webhook.construct_event(
                payload, sig_header, endpoint_secret
            )
        else:
            # For local dev without CLI active, bypass signature? No, insecure.
            # But we accept it blindly for now if secret missing (DEV ONLY)
            import json
            event = json.loads(payload)
    except ValueError as e:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError as e:
        raise HTTPException(status_code=400, detail="Invalid signature")

    # Handle events
    if event['type'] == 'account.updated':
        account = event['data']['object']
        # Update status in DB if details_submitted is true
        if account.get('details_submitted'):
            connect_id = account.get('id')
            kin = await db.kinprofile.find_unique(where={'stripeConnectAccountId': connect_id})
            if kin:
                await db.kinprofile.update(
                    where={'id': kin.id},
                    data={'stripeDetailsSubmitted': True}
                )
                print(f"Stripe Onboarding Complete for Kin: {kin.id} (Account: {connect_id})")
        pass

    return {"status": "success"}

# Developed By Sergio Valle Bastidas | valle808@hawaii.edu | @Gi0metrics
