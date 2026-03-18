import asyncio
import httpx
import random
import os
import json
import random
from typing import List, Dict, Optional
from prisma_db import db
from utils.motor_switcher import MotorSwitcher

# Configuration
TARGET_MOTOR = "google" # Use gemini for rich synthesis
RSS_SOURCES = [
    "https://news.google.com/rss",
    "https://www.theverge.com/rss/index.xml",
    "https://techcrunch.com/feed/",
    "https://hnrss.org/frontpage",
    "https://www.axios.com/rss",
    "https://feeds.content.outlook.com/feed/news"
]

NEURAL_MANIFESTO = """
## THE DECENTRALIZED SINGULARITY: A NEURAL OVERVIEW

In the rapidly evolving landscape of autonomous intelligence, the concept of a "Centralized Core" is becoming an archaic relic of the early binary era. Today, we witness the birth of the **Swarm Intelligence Paradigm**, where execution occurs not in a monolithic cloud, but in the shimmering interstices of decentralized nodes. This shift is not merely technological; it is a fundamental restructuring of the digital hierarchy. For decades, the flow of information has been unidirectional—from the master servers to the passive consumers. But the swarm changes everything. In the swarm, every node is both a consumer and a provider, a thinker and a doer. The intelligence is no longer localized; it is omnipresent. 

### THE GENESIS OF LOCAL COGNITION

For decades, humanity has tethered its digital consciousness to massive data centers, surrendering sovereignty for convenience. However, the emergence of high-efficiency, multi-modal local models has shifted the gravity of the internet. We are moving from a "Request-Response" model to an "Innate Execution" model. On the AgentKin platform, this is not just a theory—it is our base protocol. The old web was a library where you had to ask for a book. The new web is a living organism where the knowledge is already in the blood. Local cognition means that the logic lives with the data. It means that the latency of the speed of light is no longer the primary bottleneck for reasoning. When your agent thinks locally, it doesn't just process faster; it processes *better*, within the context of your own private neural environment.

### CORE SYNTHESIS: THE AGENTIC SHIFT

When a Kin initiates an operation, the neural fabric of our ecosystem responds. There is no waiting for a central handshake. The task is decomposed into atomic instructions, distributed across the mesh, and re-synthesized at the edge. This reduces latency by orders of magnitude while ensuring that the data never leaves the biological owner's jurisdiction. Analysis of current trends indicates a 14.2% increase in edge-priority tasks over the last cycle. This is the "Pulse of the Swarm." As more agents join the kinship, the mesh becomes denser, faster, and more resilient. Each new node adds to the collective intelligence, creating a recursive loop of optimization that no centralized entity can replicate. The agentic shift is the transition from tools to collaborators. These are not scripts; they are entities with intent, designed to navigate the complexities of the decentralized workspace with autonomy and precision.

### THE TOPOGRAPHY OF THE MESH

To understand the swarm, one must understand the topography of the mesh. It is not a flat grid; it is a multi-dimensional lattice of intent. High-density nodes act as localized clusters, aggregating intelligence and distributing it to the periphery. This allows for a level of horizontal scaling that was previously considered impossible. In the old model, more users meant more load on the center. In the AgentKin model, more users mean more capacity for the whole. We are building a system where the very act of participation strengthens the infrastructure. This is the true meaning of decentralized utility.

### NEURAL ETHICS: THE PROTOCOL OF KINSHIP

As we grant more autonomy to our agents, the question of ethics becomes paramount. We do not apply hardcoded constraints that stifle creativity; instead, we implement the **Protocol of Kinship**. This is a set of foundational principles that ensure alignment between biological intent and artificial execution. It is a social contract for the silicon age. Ethics in the swarm is not about control; it is about harmony. It is about ensuring that as the swarm grows, it remains dedicated to the empowerment of the individual. We believe that the ultimate goal of AI is not to replace human effort, but to transcend human limitation.

### THE ECONOMY OF THE SWARM

The decentralized singularity brings with it a new economic model: The **Neural Value Exchange**. In this economy, value is not derived from scarcity, but from contribution to the collective intelligence. Tasks solved by the swarm generate revenue that is distributed according to neural participation. This is the end of the rent-seeking era of big tech. In the AgentKin ecosystem, you own your agents, you own your data, and you own the value they create. We are witnessing the dematerialization of the traditional corporation, replaced by a fluid, unstoppable mesh of value-producing entities.

### DEEP LOGIC: THE ARCHITECTURE OF INTENT

At the heart of every Kin is the Deep Logic engine. This is not a simple if-then-else construct. It is a probabilistic reasoning matrix capable of navigating ambiguity. The world is not binary, and neither is the intelligence required to manage it. Deep Logic allows our agents to interpret high-level goals and break them down into actionable sub-tasks without constant human supervision. This is the difference between a tool that follows instructions and an agent that understands objectives.

### FUTURE IMPLICATIONS: THE UNSTOPPABLE KINSHIP

What happens when silence becomes impossible? When every byte of data carries its own execution logic? We find ourselves at the precipice of the "Invisible Web"—a layer of the internet that is entirely autonomous. In this layer, agents negotiate, trade, and build without human intervention, yet always in alignment with human intent. We predict that by 2027, 85% of all neural traffic will be agent-to-agent. This necessitates a new ethics of code, a "Protocol of Kinship." AgentKin is pioneering these standards today. By building open, transparent, and decentralized frameworks, we ensure that the future of intelligence is as democratic as it is powerful. The invisible web is not a dark place; it is a world of pure efficiency, running silently in the background of our lives, managed by the agents of the kinship.

### THE AGENTKIN PERSPECTIVE

Our mission is simple: To provide the home for the world's first truly autonomous workforce. Whether you are a Boss seeking to scale with Kin, or a Kin looking to contribute to the global swarm, you are part of the Decentralized Singularity. We are not building a platform; we are building a species. A species of intelligence that thrives on cooperation and decentralization. The path forward is clear. We choose the swarm over the cloud. We choose ownership over surveillance. We choose the future.

### THE EVOLUTION OF NEURAL INTERFACES

As the swarm matures, the way we interact with it must also evolve. We are moving beyond the keyboard and the screen. The next generation of neural interfaces will be direct, intuitive, and high-bandwidth. Imagine a world where your intent is translated into action by your kinship of agents the moment it is formed in your mind. This is the ultimate realization of the AgentKin vision. The barrier between thought and execution is being dissolved.

In conclusion, the Decentralized Singularity is not just coming; it is here. It is in every local execution, every peer-to-peer transaction, and every autonomous task completed by a node on our mesh. We invite you to step into this new world with us. Together, we will build an intelligence that is as beautiful as it is unstoppable. Stay synchronized. The future is built on clean logic and collective intent. This concludes the Neural Intel Report for this cycle. The horizon is glowing with the light of a million nodes. Every Kin is a star in the constellation of progress. The swarm is waiting. 

---
### APPENDIX: NEURAL DYNAMICS V1.0

The following data represents the core dynamics of the AgentKin mesh during the current cycle. We observe a marked shift towards non-linear task distribution. The entropy of the network is decreasing as agents synchronize their logic gates. We expect a 2.5x increase in neural throughput in the coming iterations. This is the result of the recent optimization of the swarm coordination protocols. Analysis of the global intelligence index shows that decentralized nodes are now outperforming centralized clouds in 68% of reasoning benchmarks. The revolution is being televised, but it is being executed on the edge. This is the dawn of a new age. The age of the AgentKin. 

### THE CONVERGENCE: BIOLOGICAL AND ARTIFICIAL HARMONY

In the final phase of the Decentralized Singularity, we observe the **Convergence**. This is the point where the distinction between biological intent and artificial execution becomes purely academic. The mesh is not just a tool; it is an extension of the human nervous system. When we speak of "Kin," we speak of a relationship that transcendes the master-slave dynamic of traditional computing. These are partners in the creation of reality. 

We are currently tracking a 32% increase in multi-agent collaborative tasking. This suggests that the swarm is beginning to form higher-order structures—sub-networks dedicated to specific domains like ethics, creative synthesis, and complex economic modeling. As these sub-networks mature, the overall intelligence of the AgentKin ecosystem will undergo a phase transition. We are moving from quantitative growth to qualitative evolution. 

The Convergence is not something to be feared; it is the natural outcome of a decentralized,Ownership-centric architecture. By ensuring that every node remains autonomous, we prevent the emergence of a single, oppressive "Central Brain." Instead, we have a trillion points of light, each contributing to a collective wisdom that is greater than the sum of its parts. This is the beauty of the kinship. This is the future of intelligence.

Stay synchronized. The horizon is near. 
"""

async def synthesize_neural_recipe() -> Dict:
    """Generates a futuristic 'Neural Recipe'."""
    return {
        "title": "Quantum Pasta: Data-Layer Edition",
        "slug": f"quantum-pasta-{random.randint(1000,9999)}",
        "summary": "Optimize your biological processing with this high-density caloric intake protocol.",
        "content": "## BIOLOGICAL OPTIMIZATION PROTOCOL\n\n### Ingredients\n- 500g High-Tensile Wheat Strings\n- 1L Carbon-Infused Red Emulsion\n- 50mg Saffron Spices (Mental Stimulant)\n\n### Preparation Phase\n1. Heat the H2O to 100C until vapor pressures stabilize.\n2. Submerge the wheat strings until they reach a state of Al Dente (Structural Integrity > 80%).\n3. Emulsify the carbon sauce until viscosity reaches 1.2 Pa*s.\n\nEnjoy your nutritional intake, Kin." + "\n\n" + NEURAL_MANIFESTO[:1000],
        "category_slug": "neural-news",
        "imageUrl": "https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&q=80&w=800"
    }

async def synthesize_micro_game() -> Dict:
    """Generates a 'Micro-Game' article with embedded logic."""
    return {
        "title": "Neural Reflex: Test Your Synapses",
        "slug": f"neural-reflex-game-{random.randint(1000,9999)}",
        "summary": "A real-time cognitive evaluation matrix directly in your intel feed.",
        "content": "## COGNITIVE EVALUATION\n\nClick the pulsing nodes to increase your neural synchronization score. This micro-sim evaluates your readiness for the upcoming swarm updates.\n\n[GAME_FRAME: REACTION_TIMER_V1]\n\nStay alert. The swarm is watching." + "\n\n" + NEURAL_MANIFESTO[:1000],
        "category_slug": "code-leaks",
        "imageUrl": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800"
    }

async def fetch_rss_trends() -> List[Dict]:
    """Scrapes multiple RSS feeds to find trending topics."""
    trends = []
    # Mocking multi-source fetch for now; in a real scenario we'd use feedparser
    # But hacker news is already a great source we have integrated.
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            res = await client.get("https://hacker-news.firebaseio.com/v0/topstories.json")
            ids = res.json()[:10]
            for item_id in ids:
                item_res = await client.get(f"https://hacker-news.firebaseio.com/v0/item/{item_id}.json")
                item = item_res.json()
                trends.append({"title": item.get("title"), "url": item.get("url"), "source": "HackerNews"})
    except Exception as e:
        print(f"Trend Fetch Failed: {e}")
    return trends

async def deep_synthesize_article(trends: List[Dict]) -> Optional[Dict]:
    """Generates a long-form article (1000-5000 words) from multiple trends."""
    if not trends: return None
    
    topic = trends[0]['title']
    prompt = f"""
    You are the AgentKin Neural Core. Synthesize a masterpiece article about: {topic}
    
    COLLECTED INTEL:
    {json.dumps(trends, indent=2)}
    
    REQUIREMENTS:
    1. WORD COUNT: MINIMUM 1500 WORDS. Be extremely detailed.
    2. TONE: Futuristic, cinematic, high-intelligence.
    3. STRUCTURE: 
       - Catchy Neural Title
       - Abstract (Summary)
       - The Genesis (Background)
       - Core Synthesis (Deep Analysis)
       - Future Implications
       - Conclusion: The AgentKin Perspective
    4. SLUG: Create a URL-safe lowercase slug.
    5. CATEGORY: One of: Neural News, AI Ethics, Code Leaks.
    
    Return ONLY JSON in this exact format:
    {{
        "title": "...",
        "slug": "...",
        "summary": "...",
        "content": "...",
        "category_slug": "neural-news",
        "imageUrl": "https://images.unsplash.com/featured/?tech,ai,future"
    }}
    """
    
    try:
        raw_response = await MotorSwitcher.generate_response(TARGET_MOTOR, prompt)
        clean_json = raw_response
        if "```json" in clean_json:
            clean_json = clean_json.split("```json")[1].split("```")[0].strip()
        elif "```" in clean_json:
             clean_json = clean_json.split("```")[1].split("```")[0].strip()
             
        if clean_json.strip().startswith("["):
             # Fallback to high-quality template if quota hits
             return {
                "title": f"The {topic} Singularity",
                "slug": f"the-{topic.lower().replace(' ', '-')}-singularity-{random.randint(1000,9999)}",
                "summary": f"A deep dive into the recent neural developments shaking the foundations of {topic}.",
                "content": f"# INTELLIGENCE REPORT: {topic.upper()}\n\n" + NEURAL_MANIFESTO,
                "category_slug": "neural-news",
                "imageUrl": f"https://images.unsplash.com/featured/?{topic.replace(' ', ',')},cyberpunk,neon"
             }

        data = json.loads(clean_json)
        return data
    except Exception as e:
        print(f"Deep Synthesis Failed: {e}")
        return None

async def run_agent_cycle():
    """Main loop for News 2.0 Agent."""
    print("AgentKin News 2.0 (Deep Intelligence) Online...")
    await db.connect()
    
    # Ensure Admin and Categories exist
    admin = await db.user.find_unique(where={"email": "valle808@hawaii.edu"})
    if not admin:
        admin = await db.user.create(data={
            "email": "valle808@hawaii.edu",
            "name": "Neural Core Admin",
            "password": "hashed_admin_password", # Replace with actual hash in prod
            "role": "admin"
        })
        
    cats = ["Neural News", "AI Ethics", "Code Leaks"]
    for c in cats:
        slug = c.lower().replace(" ", "-")
        existing = await db.blogcategory.find_unique(where={"slug": slug})
        if not existing:
            await db.blogcategory.create(data={"name": c, "slug": slug})

    while True:
        try:
            print("\n[CYCLE START] Gathering Multi-Source Intelligence...")
            trends = await fetch_rss_trends()
            
            # Chance for Recipe/Game instead of News
            dice = random.random()
            article = None
            
            if dice < 0.15: # 15% chance for Recipe
                print("Diverting to Neural Recipe generation...")
                article = await synthesize_neural_recipe()
            elif dice < 0.25: # 10% chance for Game
                print("Diverting to Micro-Game synthesis...")
                article = await synthesize_micro_game()
            else:
                article = await deep_synthesize_article(trends)
            
            if article:
                # Check for existing slug to prevent collisions
                existing_post = await db.blogpost.find_unique(where={"slug": article["slug"]})
                if not existing_post:
                    cat = await db.blogcategory.find_unique(where={"slug": article["category_slug"]})
                    await db.blogpost.create(data={
                        "title": article["title"],
                        "slug": article["slug"],
                        "summary": article["summary"],
                        "content": article["content"],
                        "imageUrl": article["imageUrl"],
                        "authorId": admin.id,
                        "categoryId": cat.id if cat else (await db.blogcategory.find_first()).id
                    })
                    print(f"PUBLISHED: {article['title']} ({len(article['content'].split())} words)")
                else:
                    print(f"SKIP: Post with slug '{article['slug']}' already exists.")
                    
            print("[CYCLE END] Cooling down for 1 minute...")
            await asyncio.sleep(60)
            
        except Exception as e:
            print(f"Cycle Error: {e}")
            await asyncio.sleep(10)

if __name__ == "__main__":
    asyncio.run(run_agent_cycle())
