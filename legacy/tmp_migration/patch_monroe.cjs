const fs = require('fs');
let content = fs.readFileSync('monroe.html', 'utf8');

// Find the broken section marker and replace everything from typeMessage to end of script
const brokenStart = content.indexOf('        async function typeMessage(text, role, isSovereign = false) {');
const scriptEnd = content.indexOf('    </script>', brokenStart);

if (brokenStart === -1 || scriptEnd === -1) {
    console.error('Could not find markers. brokenStart:', brokenStart, 'scriptEnd:', scriptEnd);
    process.exit(1);
}

const before = content.substring(0, brokenStart);
const after = content.substring(scriptEnd);

const fixedScript = `        async function typeMessage(text, role, isSovereign = false) {
            const div = document.createElement('div');
            div.className = \`msg \${role}\${isSovereign ? ' sovereign' : ''}\`;
            messagesEl.appendChild(div);
            isTyping = true;
            document.body.classList.add('ai-processing');

            const cursor = document.createElement('span');
            cursor.className = 'monroe-cursor';
            div.appendChild(cursor);

            async function typeNodes(sourceEl, targetEl) {
                targetEl.appendChild(cursor);
                const children = Array.from(sourceEl.childNodes);
                for (const node of children) {
                    if (node.nodeType === Node.TEXT_NODE) {
                        const textNode = document.createTextNode('');
                        targetEl.insertBefore(textNode, cursor);
                        for (const char of node.textContent) {
                            textNode.textContent += char;
                            messagesEl.scrollTop = messagesEl.scrollHeight;
                            const isPunct = '.!?,;:'.includes(char);
                            await new Promise(r => setTimeout(r, isPunct ? Math.random() * 15 + 10 : Math.random() * 5 + 2));
                        }
                    } else if (node.nodeType === Node.ELEMENT_NODE) {
                        const newEl = document.createElement(node.nodeName);
                        for (let i = 0; i < node.attributes.length; i++) {
                            newEl.setAttribute(node.attributes[i].name, node.attributes[i].value);
                        }
                        targetEl.insertBefore(newEl, cursor);
                        if (node.childNodes.length > 0) {
                            await typeNodes(node, newEl);
                            targetEl.appendChild(cursor);
                        }
                    }
                }
            }

            const temp = document.createElement('div');
            temp.innerHTML = formatText(text);
            await typeNodes(temp, div);
            cursor.remove();
            isTyping = false;
            document.body.classList.remove('ai-processing');
        }

        async function handleSend() {
            if (isTyping) return;
            const text = inputEl.value.trim();
            if (!text) return;

            addMessage(text, 'user');
            history.push({ role: 'user', content: text });
            inputEl.value = '';
            inputEl.style.height = 'auto';
            sendBtn.disabled = true;
            showThinking();

            try {
                const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
                const BASE_URL = isLocal ? 'http://localhost:3000' : '';
                const res = await fetch(\`\${BASE_URL}/api/agent-king/chat\`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: text, history, engine: 'ollama' })
                });
                if (!res.ok) {
                    throw new Error(\`API returned \${res.status}: \${res.statusText}\`);
                }
                const data = await res.json();
                removeThinking();
                const reply = data.response || 'Monroe is recalibrating...';
                history.push({ role: 'assistant', content: reply });
                await typeMessage(reply, 'bot', true);
            } catch (err) {
                removeThinking();
                console.error('[Monroe] Error:', err);
                const errMsg = \`\u26a0\ufe0f Error: \${err.message || 'Unknown error'}. Check the console for details.\`;
                await typeMessage(errMsg, 'bot');
            } finally {
                sendBtn.disabled = false;
            }
        }
`;

const newContent = before + fixedScript + after;
fs.writeFileSync('monroe.html', newContent);
console.log('monroe.html patched successfully!');
console.log('Script section around typeMessage replaced cleanly.');
