import fetch from 'node-fetch';

/**
 * Ollama Interface for Humanese Monroe
 * Connects to local LLM for natural, human-like responses.
 */
export class OllamaService {
    constructor(model = 'llama3') {
        this.baseUrl = 'http://localhost:11434/api';
        this.model = model;
    }

    async chat(messages, systemPrompt = "") {
        try {
            const formattedMessages = [
                ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
                ...messages
            ];

            const response = await fetch(`${this.baseUrl}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: this.model,
                    messages: formattedMessages,
                    stream: false,
                    options: {
                        temperature: 0.8,
                        num_predict: 2000
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`Ollama API error: ${response.status}`);
            }

            const data = await response.json();
            return {
                content: data.message.content,
                model: this.model,
                usage: { total_tokens: data.eval_count || 0 }
            };
        } catch (error) {
            console.error('[Ollama] Chat error:', error);
            throw error;
        }
    }

    async pullModel() {
        console.log(`[Ollama] Pulling model: ${this.model}...`);
        const response = await fetch(`${this.baseUrl}/pull`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: this.model, stream: false })
        });
        return await response.json();
    }
}

export const monroeOllama = new OllamaService();
