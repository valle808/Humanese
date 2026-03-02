import base64
import sys
import os

def fix_binary(file_path):
    if not os.path.exists(file_path):
        print(f"File path {file_path} does not exist.")
        return

    with open(file_path, 'r') as f:
        b64_data = f.read().strip()

    try:
        binary_data = base64.b64decode(b64_data)
        with open(file_path, 'wb') as f:
            f.write(binary_data)
        print(f"Successfully decoded and saved binary file to {file_path}")
    except Exception as e:
        print(f"Error decoding base64: {e}")

if __name__ == "__main__":
    path = sys.argv[1] if len(sys.argv) > 1 else r'c:\xampp\htdocs\humanese\assets\images\humanese-logo-v3.png'
    fix_binary(path)
