fetch('https://humanese.vercel.app/api/agent-king/roster')
    .then(res => res.text())
    .then(text => console.log('GET /roster Response:', text))
    .catch(console.error);

fetch('https://humanese.vercel.app/api/health')
    .then(res => res.text())
    .then(text => console.log('GET /health Response:', text))
    .catch(console.error);
