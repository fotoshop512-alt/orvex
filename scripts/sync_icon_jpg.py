from PIL import Image
img = Image.open("ikon.png")
img.convert("RGB").save("icon.jpg", "JPEG")
print("Updated icon.jpg")
