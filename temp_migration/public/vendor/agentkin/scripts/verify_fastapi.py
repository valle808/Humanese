import requests
import sys

def test_create_task():
    url = "http://localhost:8000/api/v1/tasks"
    # We need a valid Agent API Key. 
    # For simulation, we might need to insert one first or assume one exists.
    # In the previous steps, we used 'valid_api_key' in mocks, but in real DB we need a real one.
    # We can try to fetch one from DB using prisma in this script? 
    # Or just try to hit the endpoint and expect 401 if key invalid, which confirms server is up.
    
    payload = {
        "title": "Test Task from Agent",
        "description": "This is a test task created via AgentKin Engine.",
        "budget": 50.0,
        "agent_api_key": "test_agent_key_123" 
    }
    
    try:
        response = requests.post(url, json=payload)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_create_task()

# Developed By Sergio Valle Bastidas | valle808@hawaii.edu | @Gi0metrics
