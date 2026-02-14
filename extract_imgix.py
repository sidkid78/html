import os
import re
import urllib.parse

def extract_imgix_filenames(root_dir):
    extensions = ['.html']
    # Regex to find imgix URLs.
    # Matches http(s)://...imgix.net... until a quote, whitespace, or parenthesis.
    url_pattern = re.compile(r'(https?://[^"\s\(\)]*imgix\.net[^"\s\(\)]*)')
    
    found_files = set()
    file_locations = {}

    print("Scanning for imgix URLs...")
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if any(file.endswith(ext) for ext in extensions):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    matches = url_pattern.findall(content)
                    for url in matches:
                        # Parse URL to get the path
                        parsed = urllib.parse.urlparse(url)
                        path = parsed.path
                        # Unquote to handle %20 etc.
                        filename = os.path.basename(urllib.parse.unquote(path))
                        
                        if filename:
                            found_files.add(filename)
                            if filename not in file_locations:
                                file_locations[filename] = []
                            file_locations[filename].append(file)
                            
                except Exception as e:
                    print(f"Error reading {filepath}: {e}")

    print("\n--- Unique Files to Retrieve ---")
    with open('imgix_files.txt', 'w', encoding='utf-8') as out_f:
        sorted_files = sorted(list(found_files))
        for filename in sorted_files:
            print(filename)
            out_f.write(filename + '\n')
            
    print(f"List written to imgix_files.txt")

    print("\n--- Detailed Location Report ---")
    for filename in sorted_files:
        locs = ", ".join(file_locations[filename][:3]) # Show first 3 locs
        if len(file_locations[filename]) > 3:
            locs += "..."
        print(f"File: {filename}")
        print(f"  Found in: {locs}")

if __name__ == "__main__":
    target_dir = os.path.join(os.getcwd(), 'public')
    extract_imgix_filenames(target_dir)
