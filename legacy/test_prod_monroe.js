async function test() {
    try {
        console.log('Sending POST to https://humanese.vercel.app/api/agent-king/chat');
        const start = Date.now();
        const res = await fetch('https://humanese.vercel.app/api/agent-king/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'What is Sovereign Matrix?', history: [], engine: 'ollama' })
        });
        const duration = Date.now() - start;
        console.log('Status:', res.status, res.statusText);
        console.log('Duration:', duration, 'ms');
        for (const [key, value] of res.headers.entries()) {
            console.log(key + ': ' + value);
        }
        const text = await res.text();
        console.log('Body length:', text.length);
        console.log('Body snippet:', text.substring(0, 500));
    } catch (e) {
        console.error('Network Error:', e);
    }
}
test();
