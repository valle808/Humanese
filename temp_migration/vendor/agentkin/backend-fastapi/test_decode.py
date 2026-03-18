from dotenv import load_dotenv
import os
import base64
import json
import urllib.parse
import sys

# Load env from parent
load_dotenv(dotenv_path="../.env")

def get_real_database_url():
    url = os.environ.get("DATABASE_URL")
    if not url:
        return None
    
    print(f"Original URL: {url[:50]}...") # Print partial for safety
    
    if url.startswith("prisma+postgres://"):
        try:
            # Extract api_key param
            parsed = urllib.parse.urlparse(url)
            qs = urllib.parse.parse_qs(parsed.query)
            api_key = qs.get("api_key", [None])[0]
            
            if api_key:
                print(f"Contains '-': {'-' in api_key}")
                print(f"Contains '_': {'_' in api_key}")
                
                print(f"API Key Length: {len(api_key)}")
                print(f"API Key Start: {api_key[:10]}")
                print(f"API Key End: {api_key[-10:]}")
                
                # Fix URL decoding issues (spaces back to +)
                api_key = api_key.replace(' ', '+').strip()
                
                # Fix padding
                remainder = len(api_key) % 4
                if remainder:
                    padding = 4 - remainder
                    api_key += '=' * padding
                
                
                print(f"Final API Key Length: {len(api_key)}")
                    
                # Decode base64
                decoded = base64.urlsafe_b64decode(api_key).decode('utf-8')
                data = json.loads(decoded)
                real_url = data.get("databaseUrl")
                if real_url:
                    print(f"Decoded Real URL: {real_url[:20]}...")
                    return real_url
        except Exception as e:
            print(f"Failed to decode prisma+postgres URL: {e}")
            pass
            
    return url

resolved = get_real_database_url()
print(f"Resolved URL: {resolved[:20]}..." if resolved else "None")

# Developed By Sergio Valle Bastidas | valle808@hawaii.edu | @Gi0metrics
