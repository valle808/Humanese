import { JSDOM } from "jsdom";

const dom = new JSDOM(`<!DOCTYPE html><div></div>`);
const document = dom.window.document;
const Node = dom.window.Node;

const div = document.createElement('div');
const cursor = document.createElement('span');

async function typeNodes(sourceEl, targetEl) {
    targetEl.appendChild(cursor);

    // Create a static array of children to prevent live NodeList mutation issues
    const children = Array.from(sourceEl.childNodes);

    for (const node of children) {
        if (node.nodeType === Node.TEXT_NODE) {
            const textNode = document.createTextNode('');
            targetEl.insertBefore(textNode, cursor);
            for (const char of node.textContent) {
                textNode.textContent += char;
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            const newEl = document.createElement(node.nodeName);
            for (let i = 0; i < node.attributes.length; i++) {
                const attr = node.attributes[i];
                newEl.setAttribute(attr.name, attr.value);
            }
            targetEl.insertBefore(newEl, cursor);
            if (node.childNodes.length > 0) {
                await typeNodes(node, newEl);
                targetEl.appendChild(cursor);
            }
        }
    }
}

async function run() {
    try {
        const text = `My internal knowledge vault contains the coordinates for this.<br><br>✦ <strong>The Evolution of Artificial Intelligence: From Turing to Transformers</strong>: From Alan Turing's 1950 paper 'Computing Machinery and Intelligence' to today's multimodal transformers, AI has undergone a remarkable evolution that is reshaping every industry on Earth.<br>  ▫ _Essential Fact: Sovereign data shard retrieved from Abyssal Core._`;
        const temp = document.createElement('div');
        temp.innerHTML = text;

        await typeNodes(temp, div);
        cursor.remove();
        console.log("Success! Rendered HTML:", div.innerHTML);
    } catch (e) {
        console.error("DOM Error during typeNodes:", e.stack);
    }
}

run();
