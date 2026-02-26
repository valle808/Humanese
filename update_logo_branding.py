import os
import re

def update_logos():
    new_logo_name = 'humanese-logo-v3.png'
    
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
                
                # 1. Replace logo src paths
                # Handles both root (./assets) and sub-pages (../assets)
                asset_prefix = './assets' if d == '.' else '../assets'
                
                # Regex to find logo images and replace src + remove filters
                # We look for humanese-logo-*.png
                pattern = r'<img([^>]*)src="([^"]*humanese-logo-[^"]*\.png)"([^>]*)>'
                
                def replace_logo(match):
                    attr_before = match.group(1)
                    attr_after = match.group(3)
                    
                    # Remove any existing filter style that might be there
                    # We look for style="...filter:...;" or similar
                    attr_before = re.sub(r'style="[^"]*filter:[^"]*"', '', attr_before)
                    attr_after = re.sub(r'style="[^"]*filter:[^"]*"', '', attr_after)
                    
                    # Also handle cases where height might be in the style
                    # We'll try to keep other styles but specifically kill the filter
                    new_src = f'{asset_prefix}/images/{new_logo_name}'
                    
                    return f'<img{attr_before}src="{new_src}"{attr_after}>'

                new_content = re.sub(pattern, replace_logo, content)
                
                # 2. Cleanup specifically for the header nav and logo strip where I added inline styles
                # Remove the orange filters I added earlier
                new_content = new_content.replace('filter: invert(1) sepia(1) saturate(5) hue-rotate(0deg);', '')
                
                if new_content != content:
                    with open(fpath, 'w', encoding='utf-8') as file:
                        file.write(new_content)
                    print(f"Updated logo in {fpath}")

if __name__ == "__main__":
    update_logos()
    print("Logo replacement complete.")
