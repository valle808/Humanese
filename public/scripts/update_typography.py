import os

def update_typography():
    file_path = 'c:/xampp/htdocs/humanese/css/theme-orchestrator.css'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replacements
    old_font_import = """/* ── FONT LOADING FOR MUSEUM DAY (Playfair Display serif) ── */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800;900&display=swap');"""

    new_font_import = """/* ── FONT LOADING FOR SOVEREIGN MATRIX (Space Grotesk & JetBrains Mono) ── */
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600;700&display=swap');"""

    old_font_vars = """    /* Typography mode */
    --heading-font: 'Playfair Display', 'Georgia', serif;
    --stat-font: 'JetBrains Mono', monospace;"""

    new_font_vars = """    /* Typography mode */
    --heading-font: 'Space Grotesk', 'Inter', sans-serif;
    --stat-font: 'JetBrains Mono', monospace;"""
    
    content = content.replace(old_font_import, new_font_import)
    content = content.replace(old_font_vars, new_font_vars)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print("Successfully updated typography in theme-orchestrator.css")

if __name__ == '__main__':
    update_typography()
