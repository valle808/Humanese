#!/bin/bash
# 🖥️ Monroe Mac Provider — Launch Script
# Starts Ollama + Cloudflare Tunnel so your M1 Pro serves as Monroe's brain
# Usage: bash start-mac-provider.sh

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🧠 Monroe Mac Provider Launcher"
echo "  Model: qwen2.5:7b on Apple M1 Pro"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 1. Start Ollama if not already running
if ! curl -s http://localhost:11434 > /dev/null 2>&1; then
    echo "▶ Starting Ollama..."
    OLLAMA_ORIGINS='*' OLLAMA_HOST=0.0.0.0 ollama serve > /tmp/ollama.log 2>&1 &
    OLLAMA_PID=$!
    sleep 3
    echo "✓ Ollama running (PID: $OLLAMA_PID)"
else
    echo "✓ Ollama already running"
fi

# 2. Verify the model is available
echo "▶ Checking qwen2.5:7b..."
if ! ollama list | grep -q "qwen2.5:7b"; then
    echo "  Model not found — pulling qwen2.5:7b (4.7 GB)..."
    ollama pull qwen2.5:7b
fi
echo "✓ qwen2.5:7b ready"

# 3. Test local API
echo "▶ Testing OpenAI-compatible API..."
TEST=$(curl -s -X POST http://localhost:11434/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"qwen2.5:7b","messages":[{"role":"user","content":"say hi in 3 words"}],"max_tokens":10}' \
  | python3 -c "import sys,json; data=json.load(sys.stdin); print(data['choices'][0]['message']['content'])" 2>/dev/null || echo "FAIL")

if [ "$TEST" == "FAIL" ]; then
    echo "✗ Local API test failed"
    exit 1
fi
echo "✓ Local API working: \"$TEST\""

# 4. Start Cloudflare Tunnel
echo ""
echo "▶ Starting Cloudflare Tunnel..."
echo "  (Your Mac will get a public HTTPS URL)"
echo ""

# Run cloudflared and capture the URL
cloudflared tunnel --url http://localhost:11434 2>&1 | tee /tmp/cloudflare_tunnel.log | while IFS= read -r line; do
    echo "$line"
    
    # Extract the tunnel URL when it appears
    if echo "$line" | grep -q "trycloudflare.com"; then
        TUNNEL_URL=$(echo "$line" | grep -o 'https://[a-z0-9-]*\.trycloudflare\.com')
        if [ -n "$TUNNEL_URL" ]; then
            echo ""
            echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            echo "  ✅ YOUR MAC IS NOW MONROE'S BRAIN!"
            echo ""
            echo "  Tunnel URL: $TUNNEL_URL"
            echo ""
            echo "  Add this to Vercel environment variables:"
            echo "  LOCAL_AI_URL=$TUNNEL_URL"
            echo ""
            echo "  Vercel dashboard: https://vercel.com/sergios-projects-1a95b381/humanese/settings/environment-variables"
            echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            
            # Auto-copy to clipboard
            echo "$TUNNEL_URL" | pbcopy
            echo "  📋 URL copied to clipboard!"
            echo ""
            
            # Also write to a local file for reference
            echo "LOCAL_AI_URL=$TUNNEL_URL" > /tmp/mac_provider_url.txt
            echo "  💾 Saved to /tmp/mac_provider_url.txt"
        fi
    fi
done
