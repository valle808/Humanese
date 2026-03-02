import re
import os

filepath = 'index.html'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Hero Text
content = re.sub(
    r'<div class="char-wrapper" style="animation-delay: 0.1s;">The free, fun, and</div><br>\s*<div class="char-wrapper" style="animation-delay: 0.3s;"><span class="highlight">effective</span> way to\s*</div><br>\s*<div class="char-wrapper" style="animation-delay: 0.5s;">learn a language.</div>',
    r'<div class="char-wrapper" style="animation-delay: 0.1s;">The natural, fluid, and</div><br>\n            <div class="char-wrapper" style="animation-delay: 0.3s;"><span class="highlight">immersive</span> way to\n            </div><br>\n            <div class="char-wrapper" style="animation-delay: 0.5s;">master any language.</div>',
    content
)

# 2. Update Subhero
content = re.sub(
    r'Decentralized AI workspace\. Clean, unstoppable, and built for agents\.',
    'Humanese uses neural patterns to adapt to your unique learning style. Fast, interactive, and built for the next generation.',
    content
)

# 3. Update CTA Links
content = re.sub(
    r'onclick="getStartedButtonAnimation\(\);"',
    'onclick="window.location.href=\'./html/signup.html\'"',
    content
)
content = re.sub(
    r'onclick="alreadyAccountButtonAnimation\(\);"',
    'onclick="window.location.href=\'./html/loginpage.html\'"',
    content
)

# 4. Inject Mascot Image
content = re.sub(
    r'<div class="left-logging-header" id="left-logging-header"(\s*)style="([^"]*)"\s*></div>',
    r'<div class="left-logging-header" id="left-logging-header"\1style="\2">\n            <img src="./assets/images/mascot-stickers-new.png" alt="Humanese Mascot" style="width: 100%; animation: floatMascot 6s ease-in-out infinite;">\n          </div>',
    content
)

# 5. Add Animation CSS
if '@keyframes floatMascot' not in content:
    content = content.replace(
        '@keyframes etherealIn {',
        '@keyframes floatMascot {\n      0%, 100% { transform: translateY(0) rotate(-1deg); }\n      50% { transform: translateY(-20px) rotate(1deg); }\n    }\n\n    @keyframes etherealIn {'
    )

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully updated index.html")
