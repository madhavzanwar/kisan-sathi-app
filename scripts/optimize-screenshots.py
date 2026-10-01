import os
import glob
from PIL import Image

TMP_DIR = os.path.join(os.path.dirname(__file__), '../docs/screenshots/readme/tmp')
OUT_DIR = os.path.join(os.path.dirname(__file__), '../docs/screenshots/readme')

os.makedirs(OUT_DIR, exist_ok=True)

png_files = sorted(glob.glob(os.path.join(TMP_DIR, '*.png')))
print(f"Found {len(png_files)} PNG files to optimize...")

for png_path in png_files:
    base_name = os.path.splitext(os.path.basename(png_path))[0]
    out_path = os.path.join(OUT_DIR, f"{base_name}.webp")
    
    with Image.open(png_path) as img:
        img = img.convert('RGB')
        
        # Resize if width exceeds 1600px while maintaining aspect ratio
        max_width = 1600
        if img.width > max_width:
            new_height = int(img.height * (max_width / img.width))
            img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
            print(f"Resized {base_name}: {img.width}x{img.height}")
            
        # Save as webp with quality 85
        img.save(out_path, 'WEBP', quality=85, method=6)
        
        size_kb = os.path.getsize(out_path) / 1024
        print(f"Saved: {os.path.basename(out_path)} ({size_kb:.1f} KB)")
        if size_kb > 250:
            # Re-compress slightly if over 250 KB
            img.save(out_path, 'WEBP', quality=78, method=6)
            size_kb = os.path.getsize(out_path) / 1024
            print(f"  Adjusted: {os.path.basename(out_path)} ({size_kb:.1f} KB)")

print("\nOptimization complete!")
