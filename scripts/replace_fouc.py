import os

def replace_theme_in_html():
    count = 0
    starting_dir = 'c:/xampp/htdocs/humanese'
    
    for root, dirs, files in os.walk(starting_dir):
        # Ignore heavy directories
        if 'node_modules' in dirs:
            dirs.remove('node_modules')
        if '.git' in dirs:
            dirs.remove('.git')
        if '.vercel' in dirs:
            dirs.remove('.vercel')
            
        for file_name in files:
            if file_name.endswith('.html'):
                file_path = os.path.join(root, file_name)
                
                try:
                    with open(file_path, 'r', encoding='utf-8') as file:
                        content = file.read()
                        
                    old_str = "setAttribute('data-theme', 'day')"
                    new_str = "setAttribute('data-theme', 'night')"
                    
                    if old_str in content:
                        new_content = content.replace(old_str, new_str)
                        with open(file_path, 'w', encoding='utf-8') as file:
                            file.write(new_content)
                        count += 1
                        print(f"Updated {file_path}")
                except Exception as e:
                    pass
                    
    print(f"Replaced theme in {count} files")

if __name__ == '__main__':
    replace_theme_in_html()
