from PIL import Image
import os

# Files
source_main = r"c:\Users\Burak\Desktop\YDSPRO\public\icon.png"
source_fg   = r"c:\Users\Burak\Desktop\YDSPRO\public\icon_fg.png"
source_bg   = r"c:\Users\Burak\Desktop\YDSPRO\public\icon_bg.png"
android_res_path = r"c:\Users\Burak\Desktop\YDSPRO\android\app\src\main\res"

# Android icon dimensions
icon_sizes = {
    'mipmap-ldpi': 36,
    'mipmap-mdpi': 48,
    'mipmap-hdpi': 72,
    'mipmap-xhdpi': 96,
    'mipmap-xxhdpi': 144,
    'mipmap-xxxhdpi': 192
}

# Adaptive Icons (V26+) usually use 108dp. For xxhdpi that's 324px.
# But mipmap folders usually contain fixed sizes for the legacy fallback. 
# For adaptive icons, they are usually 108dp regardless.

# Load sources
img_main = Image.open(source_main)
img_fg = Image.open(source_fg)
img_bg = Image.open(source_bg)

# Legacy / Rounded icons
for folder, size in icon_sizes.items():
    folder_path = os.path.join(android_res_path, folder)
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)
    
    # Generic Launcher (Fallback)
    img_main.resize((size, size), Image.Resampling.LANCZOS).save(os.path.join(folder_path, 'ic_launcher.png'), 'PNG')
    # Round Launcher
    img_main.resize((size, size), Image.Resampling.LANCZOS).save(os.path.join(folder_path, 'ic_launcher_round.png'), 'PNG')
    
    # Adaptive Layers
    # Note: Modern Android expects 108dp for adaptive icons. 
    # Usually: mdpi=108, hdpi=162, xhdpi=216, xxhdpi=324, xxxhdpi=432
    adaptive_size = int(size * (108/48)) # Base 48dp -> 108dp ratio
    
    img_fg.resize((adaptive_size, adaptive_size), Image.Resampling.LANCZOS).save(os.path.join(folder_path, 'ic_launcher_foreground.png'), 'PNG')
    img_bg.resize((adaptive_size, adaptive_size), Image.Resampling.LANCZOS).save(os.path.join(folder_path, 'ic_launcher_background.png'), 'PNG')

# Web sizes
web_sizes = [16, 32, 192, 512]
for size in web_sizes:
    img_main.resize((size, size), Image.Resampling.LANCZOS).save(os.path.join(r"c:\Users\Burak\Desktop\YDSPRO\public", f'icon-{size}.png'), 'PNG')
    print(f"Created web icon: icon-{size}.png")

print("\nLauncher icons and adaptive layers generated successfully!")
