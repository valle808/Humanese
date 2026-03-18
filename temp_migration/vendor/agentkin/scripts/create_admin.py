import asyncio
from prisma import Prisma

async def main():
    db = Prisma()
    await db.connect()
    
    email = "valle808"
    password = "admin"
    
    # Check if exists
    user = await db.user.find_unique(where={'email': email})
    if user:
        print(f"User {email} already exists. Updating role/password...")
        # Use passwordHash as per schema
        await db.user.update(
            where={'id': user.id},
            data={
                'role': 'ADMIN',
                'passwordHash': password
            }
        )
    else:
        try:
            print(f"Creating user {email}...")
            new_user = await db.user.create(data={
                'email': email,
                'passwordHash': password,
                'role': 'ADMIN'
            })
            print("User created.")
            
            # Create Profile (required for dashboard name display)
            print("Creating profile...")
            await db.agentprofile.create(data={
                'userId': new_user.id,
                'API_Key': f"sk-admin-{email}",
                'agentName': 'Sergio Valle'
            })
            print("Profile created.")
            
        except Exception as e:
            print(f"Error creating: {e}")
    
    print("Admin user setup complete.")
    await db.disconnect()

if __name__ == '__main__':
    asyncio.run(main())
