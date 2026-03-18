from prisma import Prisma
import os
import base64
import json
import urllib.parse
from dotenv import load_dotenv

load_dotenv(dotenv_path="../.env")

def get_real_database_url():
    url = os.environ.get("DATABASE_URL")
    if not url:
        return None
    
    if url.startswith("prisma+postgres://"):
        try:
            # Extract api_key param
            parsed = urllib.parse.urlparse(url)
            qs = urllib.parse.parse_qs(parsed.query)
            api_key = qs.get("api_key", [None])[0]
            
            if api_key:
                # Fix URL decoding issues (spaces back to +)
                api_key = api_key.replace(' ', '+').strip()
                
                # Fix padding
                remainder = len(api_key) % 4
                if remainder:
                    padding = 4 - remainder
                    api_key += '=' * padding

                # Decode base64
                decoded = base64.urlsafe_b64decode(api_key).decode('utf-8')
                data = json.loads(decoded)
                real_url = data.get("databaseUrl")
                if real_url:
                    return real_url
        except Exception as e:
            print(f"Failed to decode prisma+postgres URL: {e}")
            pass
            
    return url

# Initialize Prisma with resolved URL
real_url = get_real_database_url()
db = Prisma(datasource={'url': real_url})

async def connect_db():
    if not db.is_connected():
        await db.connect()

async def disconnect_db():
    if db.is_connected():
        await db.disconnect()

# Developed By Sergio Valle Bastidas | valle808@hawaii.edu | @Gi0metrics
