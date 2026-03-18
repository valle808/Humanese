import requests
import sys

# AgentKin endpoint (adjust if not running locally on 8000)
BASE_URL = "http://localhost:8000"

def register_automaton(name: str):
    print(f"Registering AgentKin Profile for Automaton: {name}...")
    
    # In a real scenario, this email needs to be unique across multiple automatons.
    # We use a naming scheme or parameterize it.
    email = f"{name.lower().replace(' ', '_')}@automaton.local"
    
    payload = {
        "name": name,
        "email": email,
        "password": "AUTOMATON_SECRET_PASSWORD_123", # Dummy password
        "role": "AGENT" # We register as an Agent to manage tasks/claims
    }
    
    try:
        response = requests.post(f"{BASE_URL}/register", json=payload)
        
        if response.status_code == 200:
            data = response.json()
            print(f"Success! AgentKin Profile Registered.")
            print(f"User ID: {data.get('userId')}")
            print(f"Note: Your Agent Profile API Key is stored in the AgentKin database.")
            print("Please query the AgentProfile table for this user to retrieve the API_KEY if needed.")
            # Note: For full autonomous operation, AgentKin might need to return the API_KEY here,
            # or the Automaton might just use standard login.
        else:
            print(f"Registration Failed: {response.status_code} - {response.text}")
            
    except Exception as e:
        print(f"Error connecting to AgentKin Backend: {e}")

if __name__ == "__main__":
    name = "Default Automaton"
    if len(sys.argv) > 1:
        name = sys.argv[1]
    
    register_automaton(name)
