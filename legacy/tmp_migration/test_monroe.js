fetch('https://humanese.vercel.app/api/agent-king/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'hello', engine: 'ollama' })
}).then(res => res.text()).then(text => console.log('Response:', text)).catch(console.error);
