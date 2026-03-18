import argparse
import requests
import sys

BASE_URL = "http://localhost:8000"
API_URL = f"{BASE_URL}/api/v1"

def register(name: str):
    email = f"{name.lower().replace(' ', '_')}@openclaw.local"
    payload = {
        "name": name,
        "email": email,
        "password": "OPENCLAW_SECRET_PASSWORD_123",
        "role": "KIN" 
    }
    try:
        res = requests.post(f"{BASE_URL}/register", json=payload)
        if res.status_code == 200:
            print("Successfully registered OpenClaw agent.")
            print(res.json())
        else:
            print(f"Failed to register: {res.text}")
    except Exception as e:
        print(f"Error: {e}")

def get_kin_id():
    try:
        res = requests.get(f"{BASE_URL}/debug/kin-profile")
        if res.status_code == 200:
            return res.json().get('kin_id')
    except:
        return None
    return None

def list_tasks():
    try:
        res = requests.get(f"{API_URL}/tasks/available")
        if res.status_code == 200:
            tasks = res.json()
            if not tasks:
                print("No tasks available.")
                return
            grid = []
            for t in tasks:
                grid.append(f"ID: {t['id']} | Title: {t['title']} | Budget: ${t['budget']}")
            print("AVAILABLE TASKS:\n================\n" + "\n".join(grid))
            print("\nDETAILS:\n========")
            for t in tasks:
                print(f"ID: {t['id']}\nDescription: {t['description']}\n---")
        else:
            print(f"Failed to list tasks: {res.text}")
    except Exception as e:
        print(f"Error checking tasks: {e}")

def claim_task(task_id: str):
    kin_id = get_kin_id()
    if not kin_id:
        print("Error: Could not retrieve Kin ID.")
        return
    try:
        res = requests.post(f"{API_URL}/tasks/{task_id}/claim", json={"kin_id": kin_id})
        if res.status_code == 200:
            print(f"Successfully claimed task {task_id}.")
        elif res.status_code == 400:
            print(f"Could not claim task (probably already claimed): {res.text}")
        else:
            print(f"Failed to claim task: {res.text}")
    except Exception as e:
        print(f"Error: {e}")

def submit_task(task_id: str, proof: str):
    try:
        res = requests.post(f"{API_URL}/tasks/{task_id}/submit", json={"proof": proof})
        if res.status_code == 200:
            print(f"Successfully submitted proof for task {task_id}.")
        else:
            print(f"Failed to submit task: {res.text}")
    except Exception as e:
        print(f"Error: {e}")

def main():
    parser = argparse.ArgumentParser(description="OpenClaw Bridge to AgentKin Marketplace")
    subparsers = parser.add_subparsers(dest="command")

    parser_reg = subparsers.add_parser("register")
    parser_reg.add_argument("name", help="Name of the OpenClaw agent")

    parser_list = subparsers.add_parser("list")

    parser_claim = subparsers.add_parser("claim")
    parser_claim.add_argument("task_id", help="ID of the task to claim")

    parser_submit = subparsers.add_parser("submit")
    parser_submit.add_argument("task_id", help="ID of the task")
    parser_submit.add_argument("proof", help="Proof of work (text/summary)")

    args = parser.parse_args()

    if args.command == "register":
        register(args.name)
    elif args.command == "list":
        list_tasks()
    elif args.command == "claim":
        claim_task(args.task_id)
    elif args.command == "submit":
        submit_task(args.task_id, args.proof)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
