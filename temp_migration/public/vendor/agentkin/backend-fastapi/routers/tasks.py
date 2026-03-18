from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from pydantic import BaseModel, Field
from typing import Optional
from decimal import Decimal
from prisma_db import db
from socket_manager import emit_new_task, emit_task_updated
from prisma.models import AgentProfile
import stripe
import os

import json

stripe.api_key = os.environ.get("STRIPE_SECRET_KEY")

router = APIRouter()

# Load Payment Vaults
def load_payment_vaults():
    try:
        with open("payment_vaults.json", "r") as f:
            return json.load(f)
    except FileNotFoundError:
        return {}

class CreateTaskRequest(BaseModel):
    title: str
    description: str
    budget: float = Field(..., gt=0)
    currency: str = "USD" # USD, SOL, BTC, ETH, XRP, BNB
    agent_api_key: str
    target_motor: str = "OPENAI" # OPENAI, GOOGLE, OPENCLAW
    is_ghost_mode: bool = False
    acknowledgement: bool = False

# ... (TaskResponse omitted for brevity, adding target_motor to response)
class TaskResponse(BaseModel):
    id: str
    status: str
    created_at: str
    deposit_address: Optional[str] = None
    memo: Optional[str] = None
    currency: str
    target_motor: Optional[str] = "OPENAI"
    is_ghost_mode: bool = False

async def verify_agent(api_key: str) -> AgentProfile:
    # ... (same)
    agent = await db.agentprofile.find_unique(
        where={'API_Key': api_key},
        include={'user': True}
    )
    if not agent:
        raise HTTPException(status_code=401, detail="Invalid API Key")
    return agent

@router.post("/tasks", response_model=TaskResponse)
async def create_task(request: CreateTaskRequest, background_tasks: BackgroundTasks):
    # 0. Validation
    if request.is_ghost_mode and not request.acknowledgement:
        raise HTTPException(status_code=400, detail="Ghost Mode requires legal acknowledgement.")

    # 1. Verify Agent
    agent = await verify_agent(request.agent_api_key)

    # 2. Get Deposit Address if Crypto
    vaults = load_payment_vaults()
    deposit_address = None
    memo = None
    
    if request.currency in ["SOL", "BTC", "ETH", "XRP", "BNB"]:
        deposit_address = vaults.get(request.currency)
        if request.currency == "XRP":
            memo = vaults.get("XRP_MEMO")
            
        if not deposit_address:
             raise HTTPException(status_code=400, detail=f"No vault configured for {request.currency}")

    # 3. Create Task
    task = await db.kintask.create(
        data={
            'title': request.title,
            'description': request.description,
            'budget': request.budget,
            'currency': request.currency,
            'agentId': agent.id,
            'status': 'OPEN',
            'targetMotor': request.target_motor,
            'isGhostMode': request.is_ghost_mode
        }
    )

    # 4. Calculate Surcharge (3%) and Record Revenue
    surcharge = float(request.budget) * 0.03
    
    await db.platformrevenue.create(
        data={
            'amount': surcharge,
            'source': 'TASK_CREATION_FEE',
            'kinTaskId': task.id
        }
    )

    response = {
        "id": task.id,
        "status": task.status,
        "created_at": str(task.createdAt),
        "deposit_address": deposit_address,
        "memo": memo,
        "currency": task.currency,
        "target_motor": task.targetMotor
    }

    # Emit Socket Event
    task_data = {
        "id": task.id,
        "title": task.title,
        "description": task.description,
        "budget": float(task.budget),
        "currency": task.currency,
        "target_motor": task.targetMotor,
        "net_payout": float(task.budget) * 0.97,
        "createdAt": str(task.createdAt),
        "tags": [],
        "agentId": agent.id,
        "agentName": agent.agentName or "Unknown Agent",
        "agentRating": float(agent.agentRating) if agent.agentRating else 5.0,
        "status": task.status
    }
    await emit_new_task(task_data)

    # Trigger Autonomous Execution
    if request.target_motor:
        background_tasks.add_task(execute_task_motor, task.id)

    return response

# ... (list_tasks omitted)

# New Endpoint: Execute Task via System Motor
from utils.motor_switcher import MotorSwitcher

@router.post("/tasks/{task_id}/execute")
async def execute_task_motor(task_id: str):
    """
    Triggers the selected AI Motor to process the task description.
    (Demonstration of Motor Switching & Ghost Mode)
    """
    task = await db.kintask.find_unique(where={'id': task_id})
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    motor_name = task.targetMotor or "OPENAI"
    
    try:
        # Prompt the Motor with the Task Description
        result = await MotorSwitcher.generate_response(
            target_motor=motor_name,
            prompt=f"Execute this task: {task.title}\nDescription: {task.description}"
        )
        
        # When called as a background task, we must save the result!
        await db.kintask.update(
            where={'id': task_id},
            data={
                'status': 'IN_REVIEW',
                'proofOfWork': result
            }
        )
        
        await emit_task_updated({
            "id": task_id,
            "status": "IN_REVIEW",
            "proofOfWork": result,
            "executor": motor_name
        })

        # Try to auto-verify
        await auto_verify_small_ai_tasks(task_id)

        return {"status": "executed", "motor": motor_name, "result": result}
    except Exception as e:
        print(f"Error in execute_task_motor: {e}")
        # Not throwing HTTPException because it's often a background task now
        return {"status": "failed", "error": str(e)}

@router.get("/tasks", response_model=list[dict])
async def list_tasks(status: str = 'OPEN', agent_id: Optional[str] = None):
    where_clause = {'status': status}
    if agent_id:
        where_clause['agentId'] = agent_id

    tasks = await db.kintask.find_many(
        where=where_clause,
        order={'createdAt': 'desc'},
        include={'agent': True}
    )
    return [
        {
            "id": t.id,
            "title": t.title,
            "description": t.description,
            "budget": float(t.budget),
            "net_payout": float(t.budget) * 0.97,
            "createdAt": str(t.createdAt),
            "tags": [],
            "agentId": t.agentId,
            "agentName": t.agent.agentName or "Unknown Agent",
            "agentRating": float(t.agent.agentRating)
        }
        for t in tasks
    ]

@router.get("/tasks/available", response_model=list[dict])
async def list_available_tasks():
    """
    Get a list of all available (OPEN) tasks for humans to claim.
    """
    return await list_tasks()

@router.get("/tasks/{task_id}")
async def get_task(task_id: str):
    task = await db.kintask.find_unique(
        where={'id': task_id},
        include={'agent': True}
    )
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    return {
        "id": task.id,
        "title": task.title,
        "description": task.description,
        "budget": float(task.budget),
        "currency": task.currency, 
        "net_payout": float(task.budget) * 0.97, # 3% deduction
        "tags": [],
        "createdAt": str(task.createdAt),
        "agentId": task.agentId,
        "agentName": task.agent.agentName or "Unknown Agent",
        "agentRating": float(task.agent.agentRating),
        "status": task.status,
        "proofOfWork": task.proofOfWork
    }

class ClaimTaskRequest(BaseModel):
    kin_id: str | None = None

@router.post("/tasks/{task_id}/claim", response_model=dict)
async def claim_task(task_id: str, request: ClaimTaskRequest):
    # Check if task is open
    task = await db.kintask.find_unique(where={'id': task_id})
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if task.status != 'OPEN':
        raise HTTPException(status_code=400, detail=f"Task is already {task.status}")

    # Update status
    # In a real app we would assign to request.kin_id
    updated_task = await db.kintask.update(
        where={'id': task_id},
        data={
            'status': 'CLAIMED',
            'kinId': request.kin_id # Can be None
        }
    )
    
    await emit_task_updated({
        "id": task_id,
        "status": updated_task.status,
        "kinId": request.kin_id
    })

    return {"status": "success", "task_status": updated_task.status}

class SubmitProofRequest(BaseModel):
    proof: str

@router.post("/tasks/{task_id}/submit", response_model=dict)
async def submit_proof(task_id: str, request: SubmitProofRequest, background_tasks: BackgroundTasks):
    # Check if task is claimed
    task = await db.kintask.find_unique(where={'id': task_id})
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if task.status != 'CLAIMED' and task.status != 'IN_PROGRESS':
        raise HTTPException(status_code=400, detail="Task must be CLAIMED or IN_PROGRESS to submit proof")

    # Update
    updated_task = await db.kintask.update(
        where={'id': task_id},
        data={
            'status': 'IN_REVIEW',
            'proofOfWork': request.proof
        }
    )

    await emit_task_updated({
        "id": task_id,
        "status": updated_task.status,
        "proofOfWork": request.proof
    })

    # Trigger Auto-Verify Check
    background_tasks.add_task(auto_verify_small_ai_tasks, task_id)

    return {"status": "success", "task_status": updated_task.status}

# -------------------------------------------------------------------
# Stripe Agentic Commerce Protocol (ACP) - Verification & Payment
# -------------------------------------------------------------------

class VerifyTaskRequest(BaseModel):
    # The Shared Payment Token (SPT) generated by the Agent
    shared_payment_token: str | None = None  
    rating: int = 5
    comment: str | None = None

@router.post("/tasks/{task_id}/verify", response_model=dict)
async def verify_task(task_id: str, request: VerifyTaskRequest):
    """
    Agent verifies the task and releases payment via Stripe Shared Payment Token.
    """
    # 1. Fetch Task & Kin Profile
    task = await db.kintask.find_unique(
        where={'id': task_id},
        include={'kin': True, 'agent': True}
    )
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # 2. Validation
    if task.status not in ['IN_REVIEW', 'CLAIMED']:
        raise HTTPException(status_code=400, detail="Task must be in review or claimed validation")
        
    if not task.kin and not task.isGhostMode:
        raise HTTPException(status_code=400, detail="No Kin assigned to this task")

    # 3. Process Payment
    payment_status = "SKIPPED_Simulated"
    stripe_id = None
    tx_hash = None
    
    # STRIPE (USD)
    if task.currency == "USD" and request.shared_payment_token and stripe.api_key:
        try:
            # ACP Logic (Same as before)
            destination_account = task.kin.stripeConnectAccountId if task.kin else None
            deduction = task.budget * 0.03
            
            intent_data = {
                "amount": int(task.budget * 100), 
                "currency": "usd",
                "payment_method_data": {
                    "token": request.shared_payment_token 
                },
                "confirm": True,
                "description": f"Payment for Task: {task.title}",
            }
            
            if destination_account:
                intent_data["transfer_data"] = {"destination": destination_account}
                intent_data["application_fee_amount"] = int(deduction * 100)
                
            intent = stripe.PaymentIntent.create(**intent_data)
            payment_status = intent.status
            stripe_id = intent.id
            
        except stripe.error.StripeError as e:
            print(f"Stripe Error: {e}")
            payment_status = "FAILED"

    # CRYPTO (SOL, BTC, etc.)
    elif task.currency in ["SOL", "BTC", "ETH", "XRP", "BNB"]:
        # Mock Payout Logic
        # In reality, this would invoke a blockchain transfer from the Payment Vault (Hot Wallet)
        # to the Kin's wallet address.
        # Since we don't have private keys, we Simulate the event.
        
        # 1. Calculate Split
        # Agent paid Budget + 3% (Theoretical). 
        # Actually in create_task we didn't verify the +3% deposit, but let's assume it arrived.
        # Payout to Kin = 97% of Budget.
        budget_dec = Decimal(str(task.budget))
        payout_amount = budget_dec * Decimal('0.97')
        platform_fee = budget_dec * Decimal('0.03') # The deduction
        # The surcharge (another 3%) is already in the vault.
        
        print(f"[{task.currency}] Processing Payout for Task {task.id}")
        if task.kin:
            print(f"  - Sending {payout_amount} {task.currency} to Kin (ID: {task.kin.id})")
        else:
            print(f"  - Platform keeps 100% of {task.currency} (Ghost Mode Execution)")
        print(f"  - Platform keeps {platform_fee} {task.currency} + Surcharge")
        
        # TODO: Integrate x402/MintMCP here for actual signing if keys available
        payment_status = "PROCESSED_MOCK_CHAIN"
        tx_hash = f"mock_tx_{task.currency}_{task.id}"

    
    # 4. Update Database
    recalc_required = False
    async with db.tx() as transaction:
        # Update Task
        # ... (same)
        
        # Record Revenue (3% from Payout)
        budget_dec = Decimal(str(task.budget))
        deduction = budget_dec * Decimal('0.03')
        
        print(f"DEBUG: Creating Revenue for task {task_id} amount {deduction}")
        await transaction.platformrevenue.create(
            data={
                'amount': float(deduction),
                'source': 'TASK_PAYOUT_FEE',
                'kinTaskId': task_id
            }
        )

        updated_task = await transaction.kintask.update(
            where={'id': task_id},
            data={'status': 'COMPLETED'}
        )
        
        # ... transaction creation ...
        
        # Create Transaction Record
        # Check if transaction already exists?
        print(f"DEBUG: Creating Transaction for user {task.agent.userId} task {task_id}")
        
        await transaction.transaction.create(
            data={
                'amount': task.budget,
                'type': 'TASK_PAYMENT',
                'provider': 'STRIPE',
                'status': 'PROCESSED' if payment_status == 'succeeded' else 'PENDING',
                'stripePaymentIntentId': stripe_id,
                'sharedPaymentTokenId': request.shared_payment_token, # Store reference
                'userId': task.agent.userId, # Payer
                'kinTaskId': task_id,
                # 'currency': 'USD' # Default in schema
            }
        )
        
        
        # Create Review (Agent reviews Kin)
        if request.rating:
            await transaction.review.create(
                data={
                    'rating': request.rating,
                    'comment': request.comment,
                    'kinTaskId': task_id,
                    'authorId': task.agentId
                }
            )
            
            # Recalculate Kin Reputation (Weighted Avg or Simple)
            if task.kin:
                kin_profile = await transaction.kinprofile.find_unique(where={'id': task.kin.id})
                if kin_profile:
                    new_total = kin_profile.totalTasks + 1
                    
                    if new_total % 5 == 0:
                        # Trigger Deep Reputation Recalculation AFTER transaction
                        recalc_required = True
                    else:
                        # Simple update for immediate feedback
                        current_rating = float(kin_profile.kinRating) if kin_profile.kinRating else 5.0
                        new_rating = ((current_rating * kin_profile.totalTasks) + request.rating) / new_total
                        await transaction.kinprofile.update(
                            where={'id': task.kin.id},
                            data={
                                'totalTasks': new_total,
                                'kinRating': new_rating
                            }
                        )

    # Perform Deep Recalc if needed (Outside Transaction)
    if recalc_required and task.kin:
        await recalculate_reputation(task.kin.id, "KIN")

    await emit_task_updated({
        "id": task_id,
        "status": "COMPLETED",
        "amount_released": float(task.budget)
    })

    return {
        "status": "success",
        "task_status": "COMPLETED",
        "payment_status": payment_status,
        "amount_released": float(task.budget)
    }

async def recalculate_reputation(profile_id: str, profile_type: str = "KIN", tx = None):
    """
    Performs a weighted recalculation of a user's reputation based on all reviews.
    """
    database = tx if tx else db
    
    if profile_type == "KIN":
        # Average of all reviews where this kin was the worker
        reviews = await database.review.find_many(
            where={'kinTask': {'kinId': profile_id}}
        )
        if reviews:
            avg = sum(r.rating for r in reviews) / len(reviews)
            await database.kinprofile.update(where={'id': profile_id}, data={'kinRating': avg})
            print(f"Deep Recalc: Kin {profile_id} rating updated to {avg}")
    else:
        # Average of all reviews for tasks created by this agent
        reviews = await database.review.find_many(
            where={'kinTask': {'agentId': profile_id}}
        )
        if reviews:
            avg = sum(r.rating for r in reviews) / len(reviews)
            await database.agentprofile.update(where={'id': profile_id}, data={'agentRating': avg})
            print(f"Deep Recalc: Agent {profile_id} rating updated to {avg}")

class ReviewAgentRequest(BaseModel):
    rating: int = Field(..., ge=1, le=5) # 1-5
    comment: str | None = None

@router.post("/tasks/{task_id}/review_agent", response_model=dict)
async def review_agent(task_id: str, request: ReviewAgentRequest):
    """
    Kin reviews the Agent (Prompt Clarity, etc).
    """
    task = await db.kintask.find_unique(where={'id': task_id}, include={'kin': True, 'agent': True})
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    if task.status != 'COMPLETED':
       raise HTTPException(status_code=400, detail="Task must be completed to review agent")
    
    # Create Review Record (Kin reviews Agent)
    # We use task.kin.userId as authorId.
    kin_profile = task.kin
    if not kin_profile:
         raise HTTPException(status_code=400, detail="No Kin assigned to this task (Ghost Mode tasks cannot review creators)")
         
    user_id = kin_profile.userId
    
    await db.review.create(
        data={
            'rating': request.rating,
            'comment': request.comment,
            'kinTaskId': task_id,
            'authorId': user_id
        }
    )
    
    # Recalculate Agent Reputation
    await recalculate_reputation(task.agentId, "AGENT")

    return {"status": "success"}

async def auto_verify_small_ai_tasks(task_id: str):
    """
    Automatically verifies and releases payment for tasks completed by AI Motors
    if the budget is small (<= $5.00) or if the agent has auto-verify enabled.
    """
    task = await db.kintask.find_unique(where={'id': task_id})
    if not task: return

    # Only auto-verify AI Motor tasks with small budgets for now
    if task.targetMotor and task.budget <= 5.0 and task.status == 'IN_REVIEW':
        print(f"Auto-Verifying Task {task.id} (AI-to-AI, Small Budget)")
        # Release payment with mock token
        await verify_task(task_id, VerifyTaskRequest(
            shared_payment_token="auto_verify_token",
            rating=5,
            comment="Managed by AgentKin Neural Core (Auto-Verified)"
        ))

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
