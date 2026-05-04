from PIL import Image
import os

for path in ["görsel.jpg", "görsel2.jpg"]:
    img = Image.open(path)
    print(f"{path}: {img.size} {img.mode}")
