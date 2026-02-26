const fs = require('fs');
const path = require('path');

const targetPages = [
    {
        file: 'mission.html',
        title: 'Our Mission',
        icon: '🚀',
        content: `At Humanese, our mission is to make language learning free and fun for every kid on the planet! 
        We believe that speaking another language is like having a superpower. It helps you make new friends, 
        understand the world, and have more fun on your adventures.
        Our mascot is here to guide you every step of the way!`
    },
    {
        file: 'approach.html',
        title: 'Our Approach',
        icon: '🧠',
        content: `We use science and games to help you learn faster! 
        By playing mini-games, earning stickers, and joining squads, you'll learn new words without even trying. 
        It's like playing your favorite video game, but you end up speaking a new language!`
    },
    {
        file: 'efficacy.html',
        title: 'Does it Work?',
        icon: '📊',
        content: `Yes! Research shows that learning with Humanese is super effective. 
        Kids who use Humanese for just 15 minutes a day learn faster than in a regular classroom. 
        Plus, it's way more fun!`
    },
    {
        file: 'team.html',
        title: 'Meet the Team',
        icon: '👩‍💻',
        content: `Our team is made of teachers, scientists, and game designers who love languages! 
        We work hard to make sure our mascot stays happy and your lessons stay fun. 
        Join our network of learners and meet kids like you!`
    }
];

const sharedStyles = `
    .info-section { padding: 60px 20px; max-width: 900px; margin: 0 auto; text-align: center; }
    .info-card { background: #151515; border: 2px solid #333; border-radius: 30px; padding: 50px; position: relative; overflow: hidden; }
    .info-card h2 { font-size: 3rem; color: #58CC02; margin-top: 0; }
    .info-card p { font-size: 1.4rem; color: #CCC; line-height: 1.6; }
    .big-icon { font-size: 5rem; margin-bottom: 20px; display: block; }
    .mascot-side { position: absolute; bottom: -20px; right: -20px; width: 150px; animation: floatMascot 3s infinite; }
    .btn-action { background: #58CC02; color: #000; padding: 15px 40px; border-radius: 30px; font-weight: bold; font-size: 1.2rem; border: none; cursor: pointer; margin-top: 30px; transition: 0.2s; box-shadow: 0 5px 0 #46A302; }
    .btn-action:hover { transform: scale(1.05); }
    .btn-action:active { transform: translateY(5px); box-shadow: 0 0 0; }
    
    /* Search/Filter for all pages */
    .page-filter-container { background: #111; padding: 15px; border-radius: 15px; margin-bottom: 30px; display: flex; gap: 10px; justify-content: center; }
    .page-filter-input { background: #222; border: 1px solid #444; color: #FFF; padding: 8px 15px; border-radius: 10px; width: 250px; }
    .page-filter-btn { background: #333; color: #FFF; border: none; padding: 8px 15px; border-radius: 10px; cursor: pointer; }
    .page-filter-btn:hover { background: #58CC02; color: #000; }
`;

targetPages.forEach(p => {
    const filePath = path.join(__dirname, 'html', p.file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');

        // Replace styles
        const styleRegex = /<style>[\s\S]*?<\/style>/;
        const newStyle = `<style>
            body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; background: #050505; color: #fff; }
            .nav-header { position: fixed; top: 0; left: 0; right: 0; height: 70px; background: rgba(5,5,5,0.8); backdrop-filter: blur(10px); border-bottom: 1px solid #333; display: flex; align-items: center; justify-content: space-between; padding: 0 40px; z-index: 1000; }
            .logo img { height: 40px; }
            .nav-links { display: flex; gap: 20px; }
            .nav-links a { color: #fff; text-decoration: none; font-weight: bold; padding: 10px 20px; border: 2px solid #58CC02; border-radius: 20px; transition: all 0.2s; }
            .nav-links a:hover { background: #58CC02; color: #000; }
            @keyframes floatMascot { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
            ${sharedStyles}
            /* GREEN FOOTER EXACT MATCH */
            .green-footer { background-color: #58CC02; padding: 60px 40px; font-family: sans-serif; position: relative; z-index: 10; margin-top: auto; width: 100%; border-radius: 0; box-sizing: border-box;}
            .green-footer-container { max-width: 1200px; margin: 0 auto; display: flex; flex-wrap: wrap; justify-content: space-between; gap: 40px; }
            .footer-col h4 { color: #fff; font-size: 18px; font-weight: bold; margin-bottom: 24px; margin-top: 0; }
            .footer-col ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 14px; text-align: left; }
            .footer-col a { color: rgba(255,255,255,0.85) !important; text-decoration: none !important; font-size: 15px !important; font-weight: bold !important; transition: opacity 0.2s; background: none !important;}
            .footer-col a:hover { opacity: 1 !important; text-decoration: underline !important; color: #fff !important; }
        </style>`;
        content = content.replace(styleRegex, newStyle);

        // Replace main content
        const mainRegex = /<main class="hero">[\s\S]*?<\/main>/;
        const newMain = `
        <main style="padding-top: 100px;">
            <div class="info-section">
                <div class="page-filter-container">
                    <input type="text" class="page-filter-input" placeholder="Search for topics...">
                    <button class="page-filter-btn">Filter</button>
                </div>
                <div class="info-card">
                    <span class="big-icon">${p.icon}</span>
                    <h2>${p.title}</h2>
                    <p>${p.content}</p>
                    <img src="../assets/images/mascot-stickers-new.png" class="mascot-side" alt="Mascot">
                    <button class="btn-action">Join the Adventure!</button>
                </div>
            </div>
        </main>`;
        content = content.replace(mainRegex, newMain);

        fs.writeFileSync(filePath, content);
        console.log('Updated', p.file);
    }
});
