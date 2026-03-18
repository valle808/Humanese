import os

root_dir = r"c:\xampp\htdocs\agentkin\frontend"
target_exts = {".ts", ".tsx", ".js", ".jsx"}

wrong_sig = "# Developed By Sergio Valle Bastidas"
right_sig = "// Developed By Sergio Valle Bastidas"

count = 0

print(f"Scanning {root_dir}...")

for subdir, dirs, files in os.walk(root_dir):
    if "node_modules" in dirs:
        dirs.remove("node_modules")
    
    for file in files:
        ext = os.path.splitext(file)[1]
        if ext in target_exts:
            filepath = os.path.join(subdir, file)
            try:
                with open(filepath, "r", encoding="utf-8") as f:
                    content = f.read()
                
                if wrong_sig in content:
                    print(f"Fixing: {file}")
                    new_content = content.replace(wrong_sig, right_sig)
                    with open(filepath, "w", encoding="utf-8") as f:
                        f.write(new_content)
                    count += 1
            except Exception as e:
                print(f"Error reading {file}: {e}")

print(f"Fixed {count} files.")
