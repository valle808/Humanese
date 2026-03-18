import urllib.request
import json
import time

url = "http://localhost:8000/api/v1/login"
data = {"email": "valle808", "password": "admin"}
req = urllib.request.Request(url, 
    data=json.dumps(data).encode('utf-8'),
    headers={'Content-Type': 'application/json'}
)

print(f"Testing login to {url}...")
try:
    with urllib.request.urlopen(req) as response:
        print(f"Success Status: {response.status}")
        print(response.read().decode())
except urllib.error.HTTPError as e:
    print(f"HTTP Error: {e.code}")
    print(e.read().decode())
except Exception as e:
    print(f"Connection Error: {e}")
