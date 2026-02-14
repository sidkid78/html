import os

def update_paths(root_dir):
    extensions = ['.html']
    replacements = {
        '../images/': '/images/',
        './../images/': '/images/',
        '../audio/': '/audio/',
        './../audio/': '/audio/'
    }
    
    count = 0
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if any(file.endswith(ext) for ext in extensions):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    new_content = content
                    for old, new in replacements.items():
                        new_content = new_content.replace(old, new)
                    
                    if new_content != content:
                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        print(f"Updated: {filepath}")
                        count += 1
                except Exception as e:
                    print(f"Error processing {filepath}: {e}")

    print(f"Total files updated: {count}")

if __name__ == "__main__":
    # Assuming script is run from project root, target public/
    target_dir = os.path.join(os.getcwd(), 'public')
    print(f"Scanning directory: {target_dir}")
    update_paths(target_dir)
