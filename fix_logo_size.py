import os
import re

def standardize_logo_size():
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
                
                # Specifically target the logo images with humanese-logo-new.png and set height
                # We want height: 40px for nav logos
                pattern = r'<img([^>]*)src="([^"]*humanese-logo-new\.png)"([^>]*)>'
                
                def fix_size(match):
                    attr_before = match.group(1)
                    src = match.group(2)
                    attr_after = match.group(3)
                    
                    # If it's a small logo (nav/header), set height to 40px
                    # If it's in the logo strip, we might want it different, but 40px is generally safe for now
                    
                    # Ensure style height is set
                    # If style already exists, append or replace
                    if 'style="' in attr_before:
                        attr_before = re.sub(r'style="([^"]*)"', r'style="\1; height:40px;"', attr_before)
                    elif 'style="' in attr_after:
                        attr_after = re.sub(r'style="([^"]*)"', r'style="\1; height:40px;"', attr_after)
                    else:
                        attr_after += ' style="height:40px;"'
                    
                    return f'<img{attr_before}src="{src}"{attr_after}>'

                new_content = re.sub(pattern, fix_size, content)
                
                if new_content != content:
                    with open(fpath, 'w', encoding='utf-8') as file:
                        file.write(new_content)
                    print(f"Fixed logo size in {fpath}")

if __name__ == "__main__":
    standardize_logo_size()
