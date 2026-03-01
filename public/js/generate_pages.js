const fs = require('fs');
const path = require('path');

const pages = [
    // About
    { id: 'courses', title: 'Courses' }, { id: 'mission', title: 'Mission' },
    { id: 'approach', title: 'Approach' }, { id: 'efficacy', title: 'Efficacy' },
    { id: 'team', title: 'Team' }, { id: 'research', title: 'Research' },
    { id: 'careers', title: 'Careers' }, { id: 'brand', title: 'Brand Guidelines' },
    { id: 'store', title: 'Store' }, { id: 'press', title: 'Press' },
    { id: 'investors', title: 'Investors' }, { id: 'contact', title: 'Contact Us' },
    // Products
    { id: 'humanese', title: 'Humanese' }, { id: 'schools', title: 'Humanese for Schools' },
    { id: 'english-test', title: 'Humanese English Test' }, { id: 'abc', title: 'Humanese ABC' },
    { id: 'math', title: 'Humanese Math' }, { id: 'podcast', title: 'Podcast' },
    { id: 'business', title: 'Humanese for Business' }, { id: 'super', title: 'Super Humanese' },
    { id: 'gift', title: 'Gift Super Humanese' },
    // Apps
    { id: 'android', title: 'Humanese for Android' }, { id: 'ios', title: 'Humanese for iOS' },
    { id: 'abc-ios', title: 'Humanese ABC (iOS)' },
    // Help
    { id: 'humanese-faq', title: 'Humanese FAQs' }, { id: 'schools-faq', title: 'Schools FAQs' },
    { id: 'english-test-faq', title: 'Humanese English Test FAQs' }, { id: 'status', title: 'Status' },
    // Terms
    { id: 'community-guidelines', title: 'Community Guidelines' }, { id: 'terms', title: 'Terms' },
    { id: 'privacy', title: 'Privacy' }, { id: 'privacy-rights', title: 'Privacy Rights' },
    // Social
    { id: 'blog', title: 'Blog' }, { id: 'instagram', title: 'Instagram' },
    { id: 'facebook', title: 'Facebook' }, { id: 'twitter', title: 'Twitter' },
    { id: 'youtube', title: 'YouTube' }
];

const footerHTML = `
  <footer class="green-footer">
    <div class="green-footer-container">
      <div class="footer-col">
        <h4>About us</h4>
        <ul>
          <li><a href="./courses.html">Courses</a></li>
          <li><a href="./mission.html">Mission</a></li>
          <li><a href="./approach.html">Approach</a></li>
          <li><a href="./efficacy.html">Efficacy</a></li>
          <li><a href="./team.html">Team</a></li>
          <li><a href="./research.html">Research</a></li>
          <li><a href="./careers.html">Careers</a></li>
          <li><a href="./brand.html">Brand guidelines</a></li>
          <li><a href="./store.html">Store</a></li>
          <li><a href="./press.html">Press</a></li>
          <li><a href="./investors.html">Investors</a></li>
          <li><a href="./contact.html">Contact us</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Products</h4>
        <ul>
          <li><a href="./humanese.html">Humanese</a></li>
          <li><a href="./schools.html">Humanese for Schools</a></li>
          <li><a href="./english-test.html">Humanese English Test</a></li>
          <li><a href="./abc.html">Humanese ABC</a></li>
          <li><a href="./math.html">Humanese Math</a></li>
          <li><a href="./podcast.html">Podcast</a></li>
          <li><a href="./business.html">Humanese for Business</a></li>
          <li><a href="./super.html">Super Humanese</a></li>
          <li><a href="./gift.html">Gift Super Humanese</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Apps</h4>
        <ul>
          <li><a href="./android.html">Humanese for Android</a></li>
          <li><a href="./ios.html">Humanese for iOS</a></li>
          <li><a href="./abc-ios.html">Humanese ABC (iOS)</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Help and support</h4>
        <ul>
          <li><a href="./humanese-faq.html">Humanese FAQs</a></li>
          <li><a href="./schools-faq.html">Schools FAQs</a></li>
          <li><a href="./english-test-faq.html">Humanese English Test FAQs</a></li>
          <li><a href="./status.html">Status</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Privacy and terms</h4>
        <ul>
          <li><a href="./community-guidelines.html">Community guidelines</a></li>
          <li><a href="./terms.html">Terms</a></li>
          <li><a href="./privacy.html">Privacy</a></li>
          <li><a href="./privacy-rights.html">Respecting your "do not sell my personal information" rights</a></li>
        </ul>
        <h4 style="margin-top: 30px;">Social</h4>
        <ul>
          <li><a href="./blog.html">Blog</a></li>
          <li><a href="./instagram.html">Instagram</a></li>
          <li><a href="./facebook.html">Facebook</a></li>
          <li><a href="./twitter.html">Twitter</a></li>
          <li><a href="./youtube.html">YouTube</a></li>
        </ul>
      </div>
    </div>
  </footer>
`;

const generateTemplate = (page) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Humanese – ${page.title}</title>
    <link rel="icon" href="../assets/images/mascot-icon-new.png" type="image/png" />
    <style>
        body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; background: #050505; color: #fff; }
        .nav-header { position: fixed; top: 0; left: 0; right: 0; height: 70px; background: rgba(5,5,5,0.8); backdrop-filter: blur(10px); border-bottom: 1px solid #333; display: flex; align-items: center; justify-content: space-between; padding: 0 40px; z-index: 1000; }
        .logo img { height: 40px; }
        .nav-links { display: flex; gap: 20px; }
        .nav-links a { color: #fff; text-decoration: none; font-weight: bold; padding: 10px 20px; border: 2px solid #58CC02; border-radius: 20px; transition: all 0.2s; }
        .nav-links a:hover { background: #58CC02; color: #000; }
        
        .hero { min-height: 80vh; padding-top: 100px; display: flex; align-items: center; justify-content: center; text-align: center; }
        .hero-content { max-width: 800px; padding: 40px; }
        .hero h1 { font-size: 3.5rem; margin-bottom: 20px; color: #58CC02; }
        .hero p { font-size: 1.2rem; color: #ccc; line-height: 1.6; }
        
        .mascot-image { width: 300px; animation: float 4s ease-in-out infinite; margin-top: 40px; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }

        /* GREEN FOOTER EXACT MATCH */
        .green-footer { background-color: #58CC02; padding: 60px 40px; font-family: sans-serif; }
        .green-footer-container { max-width: 1200px; margin: 0 auto; display: flex; flex-wrap: wrap; justify-content: space-between; gap: 40px; }
        .footer-col h4 { color: #fff; font-size: 18px; font-weight: bold; margin-bottom: 24px; margin-top: 0; }
        .footer-col ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 14px; }
        .footer-col a { color: rgba(255,255,255,0.85); text-decoration: none; font-size: 15px; font-weight: bold; transition: opacity 0.2s; }
        .footer-col a:hover { opacity: 1; text-decoration: underline; }
    </style>
</head>
<body>
    <header class="nav-header">
        <a href="../index.html" class="logo"><img src="../assets/images/humanese-logo-green.png" alt="Humanese"></a>
        <div class="nav-links">
            <a href="./humanese.html">Products</a>
            <a href="./about.html">About</a>
            <a href="./android.html">Apps</a>
            <a href="./loginpage.html">Login</a>
        </div>
    </header>
    <main class="hero">
        <div class="hero-content">
            <h1>${page.title}</h1>
            <p>Welcome to the dedicated page for ${page.title}. Discover all the amazing features, resources, and insights we offer at Humanese. We are committed to making language learning fun, interactive, and effective.</p>
            <img src="../assets/images/mascot-stickers-new.png" class="mascot-image" alt="Humanese Mascot animated">
        </div>
    </main>
    ${footerHTML}
</body>
</html>`;

const outDir = path.join(__dirname, 'html');
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
}

// Generate pages
pages.forEach(p => {
    fs.writeFileSync(path.join(outDir, p.id + '.html'), generateTemplate(p));
});

// Update index.html and other special pages to use the new green footer.
const indexFile = path.join(__dirname, 'index.html');
const loginFile = path.join(__dirname, 'html', 'loginpage.html');
const signupFile = path.join(__dirname, 'html', 'signup.html');

[indexFile, loginFile, signupFile].forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        // For index.html, replace everything from `<div class="lastDiv">` to `<!-- ── Animated Logo Design Strip ── -->` using regex
        if (file.includes('index.html')) {
            content = content.replace(/<div class="lastDiv">[\s\S]*?(?=<!-- ── Animated Logo Design Strip ── -->)/, footerHTML);

            // Add green footer CSS if missing
            if (!content.includes('.green-footer')) {
                const styleAddition = `
    /* GREEN FOOTER EXACT MATCH */
    .green-footer { background-color: #58CC02; padding: 60px 40px; font-family: sans-serif; position: relative; z-index: 10; margin-top: 100px; }
    .green-footer-container { max-width: 1200px; margin: 0 auto; display: flex; flex-wrap: wrap; justify-content: space-between; gap: 40px; }
    .footer-col h4 { color: #fff; font-size: 18px; font-weight: bold; margin-bottom: 24px; margin-top: 0; }
    .footer-col ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 14px; text-align: left; }
    .footer-col a { color: rgba(255,255,255,0.85); text-decoration: none; font-size: 15px; font-weight: bold; transition: opacity 0.2s; }
    .footer-col a:hover { opacity: 1; text-decoration: underline; }
  `;
                content = content.replace('</style>', styleAddition + '\n  </style>');
            }
        } else {
            content = content.replace(/<div class="lastDiv">[\s\S]*?<\/html>/, footerHTML + '\n</body>\n</html>');
            // For login/signup, the footer does not really exist inside .lastDiv. They have a smaller terms-privacy footer.
            // We can append it before closing body tag instead to meet the requirement.
            // Actually they have `<div class="terms-privacy-container">`. Let's just append the green footer inside the main-container or bottom.
            content = content.replace('</body>', footerHTML + '\n</body>');
            if (!content.includes('.green-footer')) {
                const styleAddition = `
    /* GREEN FOOTER EXACT MATCH */
    .green-footer { background-color: #58CC02; padding: 60px 40px; font-family: sans-serif; position: relative; z-index: 10; margin-top: auto; width: 100%; border-radius: 0; box-sizing: border-box;}
    .green-footer-container { max-width: 1200px; margin: 0 auto; display: flex; flex-wrap: wrap; justify-content: space-between; gap: 40px; }
    .footer-col h4 { color: #fff; font-size: 18px; font-weight: bold; margin-bottom: 24px; margin-top: 0; }
    .footer-col ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 14px; text-align: left; }
    .footer-col a { color: rgba(255,255,255,0.85) !important; text-decoration: none !important; font-size: 15px !important; font-weight: bold !important; transition: opacity 0.2s; background: none !important;}
    .footer-col a:hover { opacity: 1 !important; text-decoration: underline !important; color: #fff !important; }
  </style>`;
                content = content.replace('</style>', styleAddition);
            }
        }

        fs.writeFileSync(file, content);
    }
});

console.log('Pages generated and footers updated successfully.');
