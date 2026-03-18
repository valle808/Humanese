from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from prisma_db import db
import uuid

router = APIRouter()

class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    role: str # 'HUMAN' or 'KIN'

class WalletRegister(BaseModel):
    address: str
    chain: str # 'SOL' or 'ETH'
    role: str

class UserLogin(BaseModel):
    email: str
    password: str

@router.post("/register")
async def register(user: UserRegister):
    # Check if exists
    existing = await db.user.find_unique(where={'email': user.email})
    if existing: raise HTTPException(400, "Email already registered")
    
    # Create User
    try:
        new_user = await db.user.create(data={
            'email': user.email,
            'passwordHash': user.password, # NOTE: Hash in production
            'name': user.name,
            'role': user.role.upper()
        })

        # Create Profile
        if user.role.upper() == 'KIN':
            await db.kinprofile.create(data={'userId': new_user.id})
        else:
            # Default to Agent Profile for Humans too for now? Or Admin?
            # Schema has AgentProfile for 'Human/Agent' usually.
            await db.agentprofile.create(data={
                'userId': new_user.id,
                'API_Key': f"sk-live-{uuid.uuid4().hex[:12]}",
                'agentName': user.name
            })
        
        return {"message": "Registration Successful", "userId": new_user.id}
    except Exception as e:
        raise HTTPException(500, str(e))

@router.post("/register-wallet")
async def register_wallet(data: WalletRegister):
    # Check by wallet address (simulated via email field for now or new field)
    # Schema doesn't have walletAddress in User, but has it in profiles?
    # Let's use email as 'wallet-{address}@agentkin.network'
    fake_email = f"wallet-{data.address[:8]}@agentkin.network"
    
    existing = await db.user.find_unique(where={'email': fake_email})
    if existing:
        return {"message": "Wallet already registered", "userId": existing.id, "role": existing.role}
    
    # Create
    new_user = await db.user.create(data={
        'email': fake_email,
        'passwordHash': 'WALLET_LOGIN_NO_PASSWORD',
        'name': f"Wallet User {data.address[:4]}",
        'role': data.role.upper()
    })
    
    if data.role.upper() == 'KIN':
        await db.kinprofile.create(data={'userId': new_user.id, 'walletAddress': data.address})
    else:
        await db.agentprofile.create(data={
            'userId': new_user.id,
            'API_Key': f"sk-wallet-{uuid.uuid4().hex[:12]}",
            'agentName': f"Owner {data.address[:4]}"
        })
        
    return {"message": "Wallet Linked", "userId": new_user.id}

@router.post("/login")
async def login(creds: UserLogin):
    print(f"DEBUG LOGIN: {creds.email} pw={creds.password}")
    user = await db.user.find_unique(where={'email': creds.email})
    print(f"DEBUG USER FOUND: {user}")
    
    # Debug attributes
    if user:
        print(f"DEBUG USER DIR: {dir(user)}")
        # Safe access to passwordHash
        stored_hash = getattr(user, 'passwordHash', None) or getattr(user, 'password', None)
        print(f"DEBUG STORED HASH: {stored_hash}")
        
        if stored_hash != creds.password:
             raise HTTPException(401, "Invalid Credentials")
    else:
        raise HTTPException(401, "Invalid Credentials")
    
    return {
        "token": f"mock-jwt-{user.id}",
        "role": user.role,
        "name": user.name
    }

# Developed By Sergio Valle Bastidas | valle808@hawaii.edu | @Gi0metrics
