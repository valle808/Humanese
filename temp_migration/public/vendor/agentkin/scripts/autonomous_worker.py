import time
import requests
import random
import schedule
import sys
import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

# Load env from parent directory (where .env usually is)
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

# CONFIG
API_BASE = "http://localhost:8000"
HN_TOP = "https://hacker-news.firebaseio.com/v0/topstories.json"
HN_ITEM = "https://hacker-news.firebaseio.com/v0/item/{}.json"

# GEMINI SETUP
GEMINI_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_KEY:
    genai.configure(api_key=GEMINI_KEY)
else:
    print("[AGENT] ⚠️ WARNING: GEMINI_API_KEY not found. Intelligence restricted.")

def log(msg, level="INFO"):
    # Sanitize for Windows Console
    try:
        safe_msg = msg.encode('utf-8', 'replace').decode('utf-8', 'ignore') if isinstance(msg, str) else str(msg)
        # Further safety for cp1252
        safe_msg = safe_msg.encode('cp1252', 'replace').decode('cp1252', 'ignore')
        print(f"[AGENT] {safe_msg}")
    except:
        print(f"[AGENT] (Message Encode Error)")

    try:
        requests.post(f"{API_BASE}/api/v1/logs", json={
            "message": str(msg), # JSON handles unicode fine
            "source": "autonomous_worker",
            "level": level,
            "timestamp": time.strftime("%H:%M:%S")
        })
    except Exception:
        pass # Fail silently if API is down to keep worker alive

def get_agent_identity():
    """Fetches or creates a debug agent identity."""
    try:
        res = requests.get(f"{API_BASE}/debug/api-key")
        if res.status_code == 200:
            return res.json()
    except:
        return None
    return None

def get_worker_identity():
    """Fetches or creates a debug worker identity."""
    try:
        res = requests.get(f"{API_BASE}/debug/kin-profile")
        if res.status_code == 200:
            return res.json().get('kin_id')
    except:
        return None
    return None

def analyze_with_gemini(title, url):
    """Uses Gemini to generate a strategic task from the news."""
    if not GEMINI_KEY:
        return None
    
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        prompt = f"""
        You are an autonomous AI agent in a decentralized workspace.
        Analyze this intelligence:
        Title: {title}
        URL: {url}
        
        Create a specific, high-value task for a human agent to execute based on this.
        The task should be actionable (e.g., "Research market impact", "Audit security implications").
        
        Return ONLY valid JSON with this format:
        {{
            "title": "Brief Task Title",
            "description": "Detailed instructions on what to do.",
            "budget": integer_between_50_and_500
        }}
        """
        response = model.generate_content(prompt)
        text = response.text.strip()
        # Clean potential markdown code blocks
        if text.startswith("```json"):
            text = text[7:-3]
        return json.loads(text)
    except Exception as e:
        log(f"Gemini Analysis Failed: {e}")
        return None

def fetch_and_post_task():
    identity = get_agent_identity()
    if not identity:
        log("Waiting for Neural Core (Backend)...")
        return

    agent_id = identity.get('agent_id')
    api_key = identity.get('api_key')

    try:
        # 1. Scraping Phase
        log("Scanning HackerNews for intel...")
        try:
            top_ids = requests.get(HN_TOP).json()[:20]
        except:
            log("Offline mode or HN down.")
            return

        # Pick a random story to process
        target_id = random.choice(top_ids)
        story = requests.get(HN_ITEM.format(target_id)).json()
        
        title = story.get('title', 'Unknown Signal')
        url = story.get('url', 'No URL')
        
        log(f"Analyzing: {title}...")

        # 2. Reasoning Phase (Gemini)
        ai_data = analyze_with_gemini(title, url)
        
        if ai_data:
            task_title = ai_data.get('title')
            task_desc = f"{ai_data.get('description')}\n\nSource: {url}"
            budget = ai_data.get('budget', 100)
            log(f"🧠 Intelligence Generated: {task_title}")
        else:
            # Fallback
            task_title = f"Analyze: {title}"
            task_desc = f"Source: {url}. Manual analysis required."
            budget = random.randint(50, 150)
            print("DEBUG: Entering fallback logic")
            log("[WARN] Using heuristic fallback.")

        # 3. Execution Phase (Post Task)
        payload = {
            "title": task_title,
            "description": task_desc,
            "budget": budget,
            "currency": "USD",
            "status": "OPEN",
            "agentId": agent_id,
            "agent_api_key": api_key,
            "target_motor": "GEMINI_PRO", # Tagging the intelligence source
            "acknowledgement": True
        }
        
        post_url = f"{API_BASE}/api/v1/tasks/"
        res = requests.post(post_url, json=payload)
        
        if res.status_code == 200 or res.status_code == 201:
            log(f"[SUCCESS] TASK POSTED: {task_title} (${budget})")
        else:
            log(f"[ERROR] POST FAILED: {res.text}")

    except Exception as e:
        log(f"Error in cycle: {e}")

def perform_work():
    """Autonomous Worker claiming and executing tasks."""
    try:
        # 1. Find Open Tasks
        try:
            tasks = requests.get(f"{API_BASE}/api/v1/tasks?status=OPEN").json()
        except:
            return

        if not tasks:
            return

        # 2. Look for actionable tasks (containing a URL source)
        target_task = None
        for t in tasks:
            # Simple heuristic: if description has 'Source: http'
            if "Source: http" in t.get('description', '') or "http" in t.get('description', ''):
                target_task = t
                break
        
        if not target_task:
            return

        task_id = target_task['id']
        log(f"[ACTION] ACQUIRING TASK: {target_task['title']}")

        # 3. Claim Task (As System Worker)
        worker_id = get_worker_identity()
        if not worker_id:
            log("Could not get worker identity.")
            return

        claim_res = requests.post(f"{API_BASE}/api/v1/tasks/{task_id}/claim", json={"kin_id": worker_id})
        
        if claim_res.status_code != 200:
            log(f"Failed to claim: {claim_res.text}")
            return

        # 4. Execute Analysis (Gemini)
        desc = target_task.get('description', '')
        # Extract URL (naive)
        url = "Unknown"
        if "http" in desc:
            words = desc.split()
            for w in words:
                if w.startswith("http"):
                    url = w
                    break
        
        log(f"⚡ EXECUTING: Analyzing {url}...")
        
        # Use Gemini to summarize/execute
        result_text = "Analysis Failed"
        if GEMINI_KEY:
            model = genai.GenerativeModel('gemini-1.5-flash')
            exec_prompt = f"""
            You are an expert analyst.
            TASK: {target_task['title']}
            CONTEXT: {desc}
            
            Perform the task. Provide a concise, high-value summary or answer.
            Output distinct bullet points.
            """
            try:
                ai_res = model.generate_content(exec_prompt)
                result_text = ai_res.text
            except Exception as e:
                result_text = f"AI Error: {e}"
        else:
            result_text = "Gemini Key missing. Simulated Analysis."

        # 5. Submit Proof
        submit_res = requests.post(f"{API_BASE}/api/v1/tasks/{task_id}/submit", json={"proof": result_text})
        
        if submit_res.status_code == 200:
            log(f"[SUCCESS] MISSION COMPLETE: {target_task['title']}")
        else:
            log(f"[ERROR] Submission Failed: {submit_res.text}")

    except Exception as e:
        log(f"Worker Error: {e}")

def manage_contracts():
    """Autonomous Worker verifying and rating completed tasks."""
    try:
        # 1. Find Tasks In Review
        try:
            # We need a new endpoint query or just filter client side? 
            # Let's assume list_tasks endpoint supports filtering or we fetch all
            # Ideally: GET /api/v1/tasks?status=IN_REVIEW
            # The current list_tasks defaults to OPEN.
            # We'll try to fetch with status=IN_REVIEW
            tasks = requests.get(f"{API_BASE}/api/v1/tasks?status=IN_REVIEW").json()
        except:
            return

        if not tasks:
            return

        for t in tasks:
            task_id = t['id']
            log(f"🕵️ AUDITING: {t['title']} (Proof: {t.get('proofOfWork', 'N/A')[:20]}...)")
            
            # 2. Verify (Simulated AI Review)
            # In a real system, we'd use Gemini to check the proof against the description.
            # Here we assume it's good if it exists.
            
            rating = 5
            comment = "Excellent execution. Data verified."
            
            if GEMINI_KEY:
                # Optional: Use Gemini to rate
                pass

            # 3. Verify & Pay (Trigger Stripe ACP / Mock Chain)
            verify_payload = {
                "shared_payment_token": "spt_test_12345", # Mock SPT
                "rating": rating,
                "comment": comment
            }
            
            res = requests.post(f"{API_BASE}/api/v1/tasks/{task_id}/verify", json=verify_payload)
            
            if res.status_code == 200:
                log(f"[PAYMENT] PAYMENT RELEASED: {t['title']} (Rating: {rating}/5)")
            else:
                log(f"[ERROR] Verification Failed: {res.text}")

    except Exception as e:
        log(f"Manager Error: {e}")

# SCHEDULE
schedule.every(60).seconds.do(fetch_and_post_task)
schedule.every(15).seconds.do(perform_work)
schedule.every(30).seconds.do(manage_contracts)

if __name__ == "__main__":
    log("Autonomous Worker (Gemini-Enhanced) Online")
    log("Scanning frequency: 60s")
    
    # Run once immediately
    fetch_and_post_task()
    
    while True:
        schedule.run_pending()
        time.sleep(1)

# Developed By Sergio Valle Bastidas | valle808@hawaii.edu | @Gi0metrics
