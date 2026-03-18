from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from nacl.signing import VerifyKey
from nacl.exceptions import BadSignatureError
import base58
import base64
from prisma_db import db

router = APIRouter()

class VerifyWalletRequest(BaseModel):
    user_id: str
    public_key: str
    signature: str # base64 encoded
    message: str # The message that was signed

@router.post("/solana/verify-wallet")
async def verify_wallet(request: VerifyWalletRequest):
    """
    Verifies a Solana wallet signature and links it to the user.
    """
    try:
        # 1. Verify Signature
        pubkey_bytes = base58.b58decode(request.public_key)
        signature_bytes = base64.b64decode(request.signature)
        message_bytes = request.message.encode('utf-8')

        verify_key = VerifyKey(pubkey_bytes)
        verify_key.verify(message_bytes, signature_bytes)

        # 2. Update User (Mock Auth: we trust user_id for now, in prod use JWT)
        # Check if wallet already used
        existing = await db.user.find_first(where={'solanaWalletAddress': request.public_key})
        if existing and existing.id != request.user_id:
             return {"error": "Wallet already linked to another user", "success": False}

        await db.user.update(
            where={'id': request.user_id},
            data={'solanaWalletAddress': request.public_key}
        )

        return {"success": True, "wallet": request.public_key}

    except BadSignatureError:
        raise HTTPException(status_code=400, detail="Invalid signature")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/solana/wallet/{user_id}")
async def get_wallet(user_id: str):
    user = await db.user.find_unique(where={'id': user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"solanaWalletAddress": user.solanaWalletAddress}

# Developed By Sergio Valle Bastidas | valle808@hawaii.edu | @Gi0metrics
