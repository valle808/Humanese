const fs = require('fs');
let content = fs.readFileSync('monroe.html', 'utf8');

const targetStr = `            isTyping = true;
            document.body.classList.add('ai-processing');

            cursor.remove();`;

const replacementStr = `            isTyping = true;
            document.body.classList.add('ai-processing');

            const cursor = document.createElement('span');
            cursor.className = 'monroe-cursor';
            // Empty cursor, styled in CSS instead of containing '▋' for cleaner look
            div.appendChild(cursor);

            async function typeNodes(sourceEl, targetEl) {
                targetEl.appendChild(cursor); // Move cursor into the current target container
                for (const node of sourceEl.childNodes) {
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
                        // Safely iterate attributes
                        for (let i = 0; i < node.attributes.length; i++) {
                            const attr = node.attributes[i];
                            newEl.setAttribute(attr.name, attr.value);
                        }
                        targetEl.insertBefore(newEl, cursor);
                        if (node.childNodes.length > 0) {
                            await typeNodes(node, newEl);
                            // Bring cursor back to the parent level after inner nodes are typed
                            targetEl.appendChild(cursor);
                        }
                    }
                }
            }

            const temp = document.createElement('div');
            temp.innerHTML = formatText(text);
            await typeNodes(temp, div);

            cursor.remove();`;

content = content.replace(targetStr, replacementStr);
fs.writeFileSync('monroe.html', content);
console.log('Patched monroe.html successfully');
