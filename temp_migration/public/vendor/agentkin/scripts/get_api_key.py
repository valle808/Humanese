import asyncio
from prisma import Prisma
from dotenv import load_dotenv
import os

load_dotenv() # Load .env from current directory

async def main():
    url = os.getenv("DATABASE_URL")
    print(f"DEBUG: DATABASE_URL found: {bool(url)}")
    
    # Explicitly pass datasources to override. 
    # Note: verify if it's 'datasource' or 'datasources' and the structure.
    # Common pattern: datasources={'db': {'url': url}}
    db = Prisma(datasources={'db': {'url': url}})
    await db.connect()
    
    agent = await db.agentprofile.find_first()
    if agent:
        print(f"API_KEY: {agent.API_KEY}")
    else:
        print("No Agent Found. Creating one...")
        # create user first...
        user = await db.user.create(
            data={
                'email': 'test_agent@example.com',
                'role': 'ADMIN'
            }
        )
        agent = await db.agentprofile.create(
            data={
                'userId': user.id,
                'API_Key': 'test-agent-api-key-123',
                'agentName': 'Test Agent'
            }
        )
        print(f"API_KEY: {agent.API_Key}")
        
    await db.disconnect()

if __name__ == "__main__":
    asyncio.run(main())

# Developed By Sergio Valle Bastidas | valle808@hawaii.edu | @Gi0metrics
