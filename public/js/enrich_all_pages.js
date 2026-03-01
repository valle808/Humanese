const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'html');

const templateHero = (title) => `
    <main style="padding-top: 100px; min-height: 60vh; background: #FFF;">
        <div class="info-section">
            <div class="page-filter-container">
                <input type="text" class="page-filter-input" id="pageSearch" placeholder="Search for ${title} topics...">
                <button class="page-filter-btn">Filter</button>
            </div>
            <div class="info-card">
                <span class="big-icon">💫</span>
                <h2 id="pageTitle">${title}</h2>
                <div id="pageContent" style="font-size: 1.2rem; color: #444; line-height: 1.6;">
                    Welcome to our dedicated space for <strong>${title}</strong>. 
                    Explore our latest updates, learn about our progress, and see how Humanese is helping 
                    everyone learn better! We are constantly working to improve this section and bring you more fun 
                    content soon.
                </div>
                <button class="btn-action" onclick="alert('Adventure logged! Get ready!')">Start Explore!</button>
            </div>
        </div>
    </main>
`;

const filterCSS = `
    .info-section { padding: 40px 20px; max-width: 900px; margin: 0 auto; text-align: center; }
    .info-card { background: #FFF; border: 2px solid #EEE; border-radius: 30px; padding: 50px; position: relative; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.05); }
    .info-card h2 { font-size: 3rem; color: #FF6E00; margin-top: 0; }
    .big-icon { font-size: 5rem; margin-bottom: 20px; display: block; animation: wiggle 3s infinite; }
    @keyframes wiggle { 0%, 100% { transform: rotate(-5deg); } 50% { transform: rotate(5deg); } }
    .btn-action { background: #FF6E00; color: #FFF; padding: 15px 40px; border-radius: 30px; font-weight: bold; font-size: 1.2rem; border: none; cursor: pointer; margin-top: 30px; transition: 0.2s; box-shadow: 0 5px 0 #CC5500; }
    .btn-action:hover { transform: scale(1.05); background: #CC5500; }
    
    .page-filter-container { background: #F9F9F9; padding: 15px; border-radius: 15px; margin-bottom: 30px; display: flex; gap: 10px; justify-content: center; border: 1px solid #EEE; }
    .page-filter-input { background: #FFF; border: 1px solid #DDD; color: #111; padding: 8px 15px; border-radius: 10px; width: 250px; }
    .page-filter-btn { background: #EEE; color: #111; border: none; padding: 8px 15px; border-radius: 10px; cursor: pointer; transition: 0.2s; }
    .page-filter-btn:hover { background: #FF6E00; color: #FFF; }
`;

function enrich(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Skip already enriched
    if (content.includes('class="info-section"')) return;

    // Extract title from <title> tag
    const titleMatch = content.match(/<title>Humanese – (.*)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : path.basename(filePath, '.html');

    // Replace placeholder hero
    content = content.replace(/<main[^>]*>[\s\S]*?<\/main>/i, templateHero(title));

    // Ensure styles are there
    if (!content.includes('class="info-section"')) {
        content = content.replace(/<\/style>/i, filterCSS + '\\n</style>');
    }

    fs.writeFileSync(filePath, content);
    console.log('Enriched', path.basename(filePath));
}

const files = fs.readdirSync(targetDir);
files.forEach(f => {
    if (f.endsWith('.html') && !['loginpage.html', 'signup.html', 'learn.html', 'profile-page.html', 'leaderboard.html', 'donations.html', 'questionarie.html'].includes(f)) {
        enrich(path.join(targetDir, f));
    }
});
console.log('Done.');
