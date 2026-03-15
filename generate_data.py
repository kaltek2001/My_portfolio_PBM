import os
import json
from pathlib import Path

# Configuration
ROOT_DIR = Path(__file__).parent
ASSETS_DIR = ROOT_DIR / "Assets"

# File type mappings
IMAGE_EXTS = {'.jpg', '.jpeg', '.png', '.gif', '.webp'}
VIDEO_EXTS = {'.mp4', '.mov', '.avi', '.webm'}
PDF_EXTS = {'.pdf'}
MODEL_EXTS = {'.gltf', '.glb'}

def generate_json_for_category(category_name):
    """Generate JSON array for a given category (Components or Assemblies)"""
    category_path = ASSETS_DIR / category_name
    if not category_path.exists():
        print(f"Warning: {category_path} not found")
        return []

    items = []

    # Each subfolder is one item
    for item_folder in category_path.iterdir():
        if not item_folder.is_dir():
            continue

        item = {
            "id": item_folder.name.lower().replace(" ", "-"),
            "title": item_folder.name,  # you can customize title logic here
            "thumbnail": "",
            "images": [],
            "videos": [],
            "drawing": [],
            "model3d": []
        }

        # Scan files in the folder
        for file in item_folder.iterdir():
            if not file.is_file():
                continue

            # Convert path to web-friendly forward slashes
            rel_path = str(file.relative_to(ROOT_DIR)).replace("\\", "/")

            ext = file.suffix.lower()

            # Check for thumbnail (exact name "Thumbnail.JPG" case‑insensitive)
            if file.stem.lower() == "thumbnail" and ext in IMAGE_EXTS:
                item["thumbnail"] = rel_path
            elif ext in IMAGE_EXTS:
                item["images"].append(rel_path)
            elif ext in VIDEO_EXTS:
                item["videos"].append(rel_path)
            elif ext in PDF_EXTS:
                item["drawing"].append(rel_path)
            elif ext in MODEL_EXTS:
                item["model3d"].append(rel_path)

        # If no explicit thumbnail was found, use the first image
        if not item["thumbnail"] and item["images"]:
            item["thumbnail"] = item["images"][0]

        # Sort lists for consistency
        for key in ["images", "videos", "drawing", "model3d"]:
            item[key].sort()

        items.append(item)

    return items

def main():
    # Generate for Components
    components = generate_json_for_category("Components")
    with open(ROOT_DIR / "components.json", "w", encoding="utf-8") as f:
        json.dump(components, f, indent=2, ensure_ascii=False)
    print(f"✅ components.json generated with {len(components)} items.")

    # Generate for Assemblies
    assemblies = generate_json_for_category("Assemblies")
    with open(ROOT_DIR / "assemblies.json", "w", encoding="utf-8") as f:
        json.dump(assemblies, f, indent=2, ensure_ascii=False)
    print(f"✅ assemblies.json generated with {len(assemblies)} items.")

if __name__ == "__main__":
    main()