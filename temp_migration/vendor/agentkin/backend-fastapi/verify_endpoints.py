import requests
import json

BASE_URL = "http://localhost:8000/api/v1"

def test_chat():
    print("Testing /chat...")
    payload = {"message": "How do I install AgentKin?"}
    try:
        r = requests.post(f"{BASE_URL}/chat", json=payload, timeout=10)
        print(f"Status: {r.status_code}")
        print(f"Response: {r.text[:200]}...")
    except Exception as e:
        print(f"Chat failed: {e}")

def test_remote():
    print("\nTesting /test-remote...")
    try:
        r = requests.get(f"{BASE_URL}/test-remote?action=openWindow", timeout=10)
        print(f"Status: {r.status_code}")
        print(f"Response: {r.json()}")
    except Exception as e:
        print(f"Remote failed: {e}")

if __name__ == "__main__":
    test_chat()
    test_remote()
