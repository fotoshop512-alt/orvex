from PIL import Image
import os

def process_icon(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    width, height = img.size
    
    # Simple background removal (assuming white background)
    # Actually, let's just find the non-white bounding box first
    datas = img.getdata()
    
    new_data = []
    for item in datas:
        # If it's very white, make it transparent
        if item[0] > 240 and item[1] > 240 and item[2] > 240:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
    
    img.putdata(new_data)
    
    # Crop to content
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    # Resize to 1024x1024
    img = img.resize((1024, 1024), Image.Resampling.LANCZOS)
    img.save(output_path, "PNG")
    print(f"Processed {input_path} -> {output_path}")

path1 = "görsel.jpg"
path2 = "görsel2.jpg"

print(f"File sizes: {path1}: {os.path.getsize(path1)}, {path2}: {os.path.getsize(path2)}")

# I'll try to process both to see which one looks like the full icon
process_icon(path1, "temp_icon1.png")
process_icon(path2, "temp_icon2.png")
