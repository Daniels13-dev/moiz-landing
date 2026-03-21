import os
import sys

print("Loading rembg...")
try:
    from rembg import remove
    print("rembg loaded successfully.")
except ImportError as e:
    print(f"ImportError: {e}")
    sys.exit(1)

indir = 'public/products'

for filename in sorted(os.listdir(indir)):
    if filename.endswith('.png') or filename.endswith('.jpg'):
        if filename.endswith('-transparent.png'):
            continue
            
        base = os.path.splitext(filename)[0]
        output_path = os.path.join(indir, base + '-transparent.png')
        input_path = os.path.join(indir, filename)
        
        # In case the image was already converted from its other extension pair
        if os.path.exists(output_path):
            if os.path.getsize(output_path) > 0:
                continue
                
        print(f"Processing {input_path} -> {output_path}")
        try:
            with open(input_path, 'rb') as i:
                img_data = i.read()
                print(f"Read {len(img_data)} bytes. Removing background...")
                out_data = remove(img_data)
                print(f"Background removed. Output is {len(out_data)} bytes.")
                
            with open(output_path, 'wb') as o:
                o.write(out_data)
            print(f"Saved {output_path} successfully.")
        except Exception as e:
            print(f"Error processing {filename}: {e}")

print("Done processing all images.")
