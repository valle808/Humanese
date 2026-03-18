import re
import os

# 1. Restore courses.html custom hero and nodes
filepath = 'html/courses.html'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the over-enriched main with the custom scenic hero and network hero
scenic_hero_content = """
  <main class="courses-main">
    <section class="hero-kids">
      <div class="hero-kids-content">
        <h1 class="bounce-title">
          <span>L</span><span>E</span><span>A</span><span>R</span><span>N</span>
          &nbsp;
          <span>I</span><span>S</span>
          &nbsp;
          <span>A</span><span>N</span>
          &nbsp;
          <span>A</span><span>D</span><span>V</span><span>E</span><span>N</span><span>T</span><span>U</span><span>R</span><span>E</span>
        </h1>
        <p>Explore magical worlds and master new languages with your Humanese parrot friend!</p>

        <div class="scenic-container" id="scenicHero">
          <div class="scenic-cloud" style="top: 40px; left: 60px; animation-delay: 0s;"></div>
          <div class="scenic-cloud" style="top: 80px; left: 240px; animation-delay: -3s;"></div>
          <div class="scenic-mountain"></div>
          <div class="scenic-river">
            <div class="river-highlight"></div>
          </div>
          <div class="scenic-tree">
            <div class="tree-trunk"></div>
            <div class="tree-leaves"></div>
          </div>
          <!-- Animated Mascot (CSS Only) -->
          <div class="scenic-parrot">
            <div class="parrot-body">
              <div class="parrot-wing"></div>
              <div class="parrot-eye">
                <div class="parrot-pupil"></div>
              </div>
              <div class="parrot-beak"></div>
            </div>
          </div>
          <div class="scenic-butterfly" style="top: 100px; left: 100px; animation-delay: 0s;">🦋</div>
          <div class="scenic-butterfly" style="top: 150px; left: 300px; animation-delay: -2s;">🦋</div>
          <div class="mascot-speech-bubble" id="mascotBubble">Click us for a tip!</div>
        </div>

        <div class="xp-bar-container">
          <div class="xp-bar" id="xpBar" style="width: 30%;">Level 14 - Adventure Progress: 30%</div>
        </div>
      </div>
    </section>

    <section class="network-hero">
      <div class="network-bg">
        <div class="node" style="top: 20%; left: 15%; animation-delay: 0s;">🇪🇸</div>
        <div class="node" style="top: 60%; left: 10%; animation-delay: -2s;">🇫🇷</div>
        <div class="node" style="top: 30%; left: 80%; animation-delay: -4s;">🇯🇵</div>
        <div class="node" style="top: 70%; left: 75%; animation-delay: -1s;">🇩🇪</div>
        <div class="node" style="top: 15%; left: 50%; animation-delay: -3s;">🇮🇹</div>
        <div class="node" style="top: 80%; left: 45%; animation-delay: -5s;">🇧🇷</div>
      </div>
      <div class="hero-kids-content">
        <h2 style="font-size: 3rem; margin-bottom: 20px;">Your Language Network</h2>
        <p>Connect with millions of learners in the Humanese neural dimension.</p>
      </div>
    </section>
  </main>
"""

content = re.sub(r'<main[^>]*>[\s\S]*?<\/main>', scenic_hero_content, content)

# 2. Fix colors in courses.html (Grep remnants)
content = content.replace('#58CC02', '#FF6E00')
content = content.replace('#46A302', '#CC5500')
content = content.replace('humanese-logo-green.png', 'humanese-logo-white.png')

# 3. Fix Logo strip filter/style
content = content.replace('filter: drop-shadow(0 0 20px #58CC02)', 'filter: drop-shadow(0 0 20px #FFAD00)')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully restored courses.html custom hero")

# 4. Global Footer Transition (All HTML files)
target_dirs = ['.', 'html']
for d in target_dirs:
    for f in os.listdir(d):
        if f.endswith('.html'):
            fpath = os.path.join(d, f)
            with open(fpath, 'r', encoding='utf-8') as html_file:
                c = html_file.read()
            
            # Change footer and logo
            new_c = c.replace('#58CC02', '#FF6E00')
            new_c = new_c.replace('#46A302', '#CC5500')
            new_c = new_c.replace('humanese-logo-green.png', 'humanese-logo-white.png')
            
            if new_c != c:
                with open(fpath, 'w', encoding='utf-8') as html_file:
                    html_file.write(new_c)
                print(f"Updated footer/logos in {fpath}")
