from PIL import Image, ImageOps

def check_bbox(path):
    img = Image.open(path)
    gray = ImageOps.grayscale(img)
    inverted = ImageOps.invert(gray)
    mask = inverted.point(lambda p: 255 if p > 30 else 0)
    print(f"{path} bbox: {mask.getbbox()}")

check_bbox("görsel.jpg")
check_bbox("görsel2.jpg")
