import os
import re

def update_favicons():
    new_favicon_name = 'humanese-favicon-v2.png'
    
    # Target root and html/ directory
    targets = ['.', 'html']
    
    for d in targets:
        if not os.path.exists(d):
            continue
            
        for f in os.listdir(d):
            if f.endswith('.html'):
                fpath = os.path.join(d, f)
                with open(fpath, 'r', encoding='utf-8') as file:
                    content = file.read()
                
                # Handles both root (./assets) and sub-pages (../assets)
                asset_prefix = './assets' if d == '.' else '../assets'
                
                # Regex to find favicon links and replace href
                # We catch any rel="icon" or related and replace the href regardless of old filename
                pattern = r'<link([^>]*)rel="([^"]*icon[^"]*)"([^>]*)href="([^"]*\.(png|ico|svg))"([^>]*)>'
                
                def replace_favicon(match):
                    attr_before = match.group(1)
                    rel_attr = match.group(2)
                    attr_mid = match.group(3)
                    attr_after = match.group(6)
                    
                    new_href = f'{asset_prefix}/images/{new_favicon_name}'
                    
                    return f'<link{attr_before}rel="{rel_attr}"{attr_mid}href="{new_href}"{attr_after}>'

                new_content = re.sub(pattern, replace_favicon, content)
                
                if new_content != content:
                    with open(fpath, 'w', encoding='utf-8') as file:
                        file.write(new_content)
                    print(f"Updated favicon in {fpath}")

if __name__ == "__main__":
    update_favicons()
    print("Favicon replacement complete.")
