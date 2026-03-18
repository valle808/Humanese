import asyncio
import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend-fastapi'))

from prisma_db import db, connect_db, disconnect_db

async def seed_admin():
    print("Connecting to DB...")
    await connect_db()
    
    email = "valle808" # User asked for 'user: valle808', usually email field
    # But schema has email unique. I'll use it as email or adjust schema?
    # User schema: email (unique), name, password.
    # I'll Assume 'valle808' is the email for login purposes, or I'll append @agentkin.network
    # "add user valle808" -> login form asks for "Email".
    # I will create email "valle808" (if validator allows) or "valle808@admin.com"?
    # Login.html input type="text" or "email"?
    # Let's check login.html. It usually expects email.
    
    target_email = "valle808" 
    
    # Check if exists
    user = await db.user.find_unique(where={'email': target_email})
    if user:
        print(f"User {target_email} already exists. Updating password...")
        await db.user.update(
            where={'email': target_email},
            data={'password': 'admin', 'role': 'ADMIN'}
        )
    else:
        print(f"Creating Admin {target_email}...")
        user = await db.user.create(
            data={
                'email': target_email,
                'password': 'admin',
                'name': 'Valle808 Admin',
                'role': 'ADMIN'
            }
        )
        
    # Ensure Agent Profile
    profile = await db.agentprofile.find_unique(where={'userId': user.id})
    if not profile:
        await db.agentprofile.create(
            data={
                'userId': user.id,
                'API_Key': 'sk-admin-valle808',
                'agentName': 'Overlord Valle'
            }
        )
        
    print("✅ Admin Seeded: valle808 / admin")
    await disconnect_db()

if __name__ == "__main__":
    asyncio.run(seed_admin())

# Developed By Sergio Valle Bastidas | valle808@hawaii.edu | @Gi0metrics
