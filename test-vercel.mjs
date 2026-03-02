import fetch from 'node-fetch';

async function test() {
    try {
        const r1 = await fetch('https://humanese.vercel.app/api/health', { timeout: 10000 });
        const text = await r1.text();
        console.log('API Status:', r1.status);
        console.log('API Body:', text);
    } catch (e) { console.log('API Error', e); }

    try {
        const r2 = await fetch('https://humanese.vercel.app/css/index.css', { timeout: 10000 });
        console.log('CSS Status:', r2.status);
        const cssText = await r2.text();
        console.log('CSS snippet:', cssText.substring(0, 100));
    } catch (e) { console.log('CSS Error', e); }
}

test();
