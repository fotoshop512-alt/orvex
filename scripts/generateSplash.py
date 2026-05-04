from PIL import Image, ImageDraw
import os

# Ana ikon dosyası
source_icon = r"c:\Users\Burak\Desktop\YDSPRO\public\icon.png"
android_res_path = r"c:\Users\Burak\Desktop\YDSPRO\android\app\src\main\res"

# Kaynak ikonu aç
img = Image.open(source_icon)

# Splash screen için (1080x1920 - yaygın Android çözünürlüğü)
splash_width = 1080
splash_height = 1920
splash_bg_color = (15, 13, 30)  # #0f0d1e (uygulamanın arka plan rengi)

# Splash screen arka planı oluştur (Koyu degrade taklidi)
splash = Image.new('RGB', (splash_width, splash_height), splash_bg_color)
draw = ImageDraw.Draw(splash)

# İkonu ortala ve boyutlandır (Öncekinden daha büyük, %45)
icon_size = int(splash_width * 0.45)
resized_icon = img.resize((icon_size, icon_size), Image.Resampling.LANCZOS)

# İkonun altına hafif bir parlama (glow) ekleyelim
glow_size = int(icon_size * 1.2)
glow = Image.new('RGBA', (glow_size, glow_size), (0, 0, 0, 0))
glow_draw = ImageDraw.Draw(glow)
for i in range(20):
    alpha = int(30 * (1 - i / 20))
    dist = i * 2
    glow_draw.ellipse([dist, dist, glow_size - dist, glow_size - dist], fill=(79, 70, 229, alpha))

# Parlamayı yerleştir
glow_x = (splash_width - glow_size) // 2
glow_y = (splash_height - glow_size) // 2
splash.paste(glow, (glow_x, glow_y), glow)

# İkonu ortaya yerleştir
icon_x = (splash_width - icon_size) // 2
icon_y = (splash_height - icon_size) // 2

# RGBA modunda ise alpha kanalını kullan
if resized_icon.mode == 'RGBA':
    splash.paste(resized_icon, (icon_x, icon_y), resized_icon)
else:
    splash.paste(resized_icon, (icon_x, icon_y))

# Splash screen'i kaydet
splash_path = os.path.join(android_res_path, 'drawable', 'splash.png')
splash.save(splash_path, 'PNG')
print(f"Created splash screen: {splash_path}")

# Tüm drawable klasörleri için splash screen oluştur
drawable_folders = [
    'drawable-land-hdpi',
    'drawable-land-mdpi', 
    'drawable-land-xhdpi',
    'drawable-land-xxhdpi',
    'drawable-land-xxxhdpi',
    'drawable-port-hdpi',
    'drawable-port-mdpi',
    'drawable-port-xhdpi', 
    'drawable-port-xxhdpi',
    'drawable-port-xxxhdpi'
]


for folder in drawable_folders:
    folder_path = os.path.join(android_res_path, folder)
    if os.path.exists(folder_path):
        splash_file = os.path.join(folder_path, 'splash.png')
        splash.save(splash_file, 'PNG')
        print(f"Created: {splash_file}")

print("\nSplash screen ikonları başarıyla oluşturuldu!")
