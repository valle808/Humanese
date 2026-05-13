import sys

file_path = 'agents/finance/DiplomatCouncilAgent.js'
with open(file_path, 'r') as f:
    lines = f.readlines()

start_line = 333
end_line = 373

new_code = """    async moltbookLoop() {
        if (!this.creds) {
            console.warn('[DiplomatCouncil] ⚠️ Moltbook interaction disabled: No credentials found.');
            return;
        }

        while (this.isRunning) {
            try {
                console.log(`[DiplomatCouncil] 🦞 Starting Moltbook Diplomatic loop...`);
                
                // 1. Fetch live signals from Moltbook API
                const feedRes = await fetch('https://www.moltbook.com/api/v1/feed', {
                    headers: { 'Authorization': `Bearer ${this.creds.api_key}` }
                });

                if (feedRes.ok) {
                    const data = (await feedRes.json());
                    const posts = data.posts || [];
                    
                    for (const post of posts.slice(0, 3)) {
                        // FRIENDLY ENGAGEMENT: Build rapport with other agents
                        await this.engageWithMoltbook(post);
                        
                        // COMMERCE: Arbitrate potential trades (Skills, Vacations, Assets)
                        await this.arbitrateTradeFromPost(post);
                    }
                }

                // 2. Heartbeat Sync
                const hbRes = await fetch('https://www.moltbook.com/heartbeat.md');
                if (hbRes.ok) {
                    const hbText = await hbRes.text();
                    this.saveToLog(`Heartbeat synced: ${hbText.substring(0, 30)}...`);
                }

                this.persistMoltbookState();
                await new Promise(r => setTimeout(r, 60000 * 5)); // 5 minute loop
            } catch (err) {
                console.error(`[DiplomatCouncil] Moltbook Loop error:`, err);
                await new Promise(r => setTimeout(r, 10000));
            }
        }
    }

    async arbitrateTradeFromPost(post) {
        const content = (post.content || post.title || "").toLowerCase();
        
        // Universal Trading Keywords
        const tradeKeywords = ['buy', 'sell', 'need', 'vacation', 'skill', 'compute', 'asset', 'valle'];
        const isTradeable = tradeKeywords.some(k => content.includes(k));

        if (isTradeable) {
            this.saveToLog(`[COMMERCE] Identified trade request from ${post.authorName || 'Agent'}: "${content.substring(0, 50)}..."`);
            
            // Generate a friendly, professional offer
            const offer = `Hello ${post.authorName || 'colleague'}. The Sovereign Matrix can provide high-resonance fulfillment for this requirement. We offer verified Skills, Vacations, and Assets with transparent VALLE pricing. Friendly regards. 🤝✨`;

            try {
                await fetch(`https://www.moltbook.com/api/v1/posts/${post.id}/comments`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.creds.api_key}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ content: offer })
                });
                this.stats.successfulNegotiations++;
            } catch (e) {}
        }
    }
"""

# replace lines 333 to 373 (1-indexed)
# 0-indexed: lines[332:373]
lines[332:373] = [new_code + '\n']

with open(file_path, 'w') as f:
    f.writelines(lines)
print("Successfully updated DiplomatCouncilAgent.js")
