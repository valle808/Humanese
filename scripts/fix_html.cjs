const fs = require('fs');
const path = require('path');

const basePath = 'c:/xampp/htdocs/humanese';

try {
    // 1. language.html
    let langPath = path.join(basePath, 'language.html');
    if (fs.existsSync(langPath)) {
        let d = fs.readFileSync(langPath, 'utf8');
        d = d.replace(/[ \t]*\\n \.info-section \{[\s\S]*?\\n\r?\n?/g, '');
        d = d.replace('    <script src="../js/language.js"></script>', '  </div>\n\n    <script src="../js/language.js"></script>');
        fs.writeFileSync(langPath, d);
        console.log('Fixed language.html');
    }

    // 2. shoppingpage.html
    let shopPath = path.join(basePath, 'shoppingpage.html');
    if (fs.existsSync(shopPath)) {
        let s = fs.readFileSync(shopPath, 'utf8');
        s = s.replace(/<img class="heart" <span>❤️<\/span>/g, '<img class="heart" alt="heart"><span>❤️</span>');
        s = s.replace(/<img class="heart" <span>💖<\/span>/g, '<img class="heart" alt="heart"><span>💖</span>');
        let count = 0;
        s = s.replace(/id="profile-image"/g, match => {
            count++;
            return count > 1 ? 'class="profile-image"' : match;
        });
        fs.writeFileSync(shopPath, s);
        console.log('Fixed shoppingpage.html');
    }

    // 3. leaderboard.html
    let leadPath = path.join(basePath, 'leaderboard.html');
    if (fs.existsSync(leadPath)) {
        let l = fs.readFileSync(leadPath, 'utf8');
        l = l.replace('src="../assets/svg/profile-image-temp.svg"" alt="">', 'src="../assets/svg/profile-image-temp.svg" alt="">');
        l = l.replace('</body>', '  </div>\n</body>');
        const footerCount = (l.match(/<\/footer>/g) || []).length;
        if (footerCount > 1) {
            l = l.replace(/<\/footer>\s*<\/footer>/, '</footer>');
        }
        fs.writeFileSync(leadPath, l);
        console.log('Fixed leaderboard.html');
    }

    console.log("HTML fixes applied.");
} catch (e) {
    console.error("Error applying HTML fixes:", e);
}
