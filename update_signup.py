import re
import os

filepath = 'html/signup.html'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update :root
content = re.sub(
    r':root \{[^}]*--bg-primary:[^;]*#050505[^}]*\}',
    r':root {\n      --bg-primary: #FFFFFF;\n      --bg-surface: rgba(245, 245, 245, 0.8);\n      --border-subtle: #EEEEEE;\n      --text-primary: #111111;\n      --text-secondary: #444444;\n      --accent-primary: #FF6E00;\n    }',
    content,
    flags=re.DOTALL
)

# 2. Update box-shadow for container
content = re.sub(
    r'box-shadow: 0 0 40px rgba\(88, 204, 2, 0.15\);',
    r'box-shadow: 0 0 40px rgba(255, 110, 0, 0.1);',
    content
)

# 3. Update input field background
content = re.sub(
    r'background: rgba\(0, 0, 0, 0.5\) !important;',
    r'background: #F9F9F9 !important;',
    content
)

# 4. Update login button hover
content = re.sub(
    r'\.login-button:hover \{[^}]*background: rgba\(88, 204, 2, 0.1\) !important;[^}]*\}',
    r'.login-button:hover {\n      background: rgba(255, 110, 0, 0.05) !important;\n      border-color: var(--accent-primary) !important;\n    }',
    content,
    flags=re.DOTALL
)

# 5. Update create account button
content = re.sub(
    r'background-color: var\(--accent-primary\) !important;\s*color: #000 !important;\s*box-shadow: 0 4px 0px #46A302 !important;',
    r'background-color: var(--accent-primary) !important;\n      color: #FFF !important;\n      box-shadow: 0 4px 0px #CC5500 !important;',
    content
)

# 6. Final check on footer color (if not already orange)
content = re.sub(
    r'\.green-footer \{ background-color: #58CC02;',
    r'.green-footer { background-color: #FF6E00;',
    content
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully updated signup.html")
