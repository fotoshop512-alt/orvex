
import os
import urllib.request

covers = {
    "alice.jpg": "https://images.unsplash.com/photo-1517771744216-9e6b66dd55e9?w=600&q=80",
    "moby_dick.jpg": "https://images.unsplash.com/photo-1466027173167-270e5b018599?w=600&q=80",
    "king_yellow.jpg": "https://images.unsplash.com/photo-1635830625698-3b9e00253cb4?w=600&q=80",
    "skybound.jpg": "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80",
    "glass_library.jpg": "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&q=80",
    "circles_ice.jpg": "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=80",
    "copper_sun.jpg": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80",
    "garden_glacier.jpg": "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600&q=80",
    "martian_signal.jpg": "https://images.unsplash.com/photo-1540156999710-9dd929949666?w=600&q=80",
    "floating_letters.jpg": "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&q=80",
    "wind_archivist.jpg": "https://images.unsplash.com/photo-1489447068241-b3490214e879?w=600&q=80",
    "lost_city.jpg": "https://images.unsplash.com/photo-1565063857322-262145325178?w=600&q=80",
    "digital_shadows.jpg": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80",
    "last_garden.jpg": "https://images.unsplash.com/photo-1528696892704-5e1122852276?w=600&q=80",
    "istanbul_shadows.jpg": "https://images.unsplash.com/photo-1541432906375-9e3f65b38f87?w=600&q=80"
}

output_dir = "public/covers"
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

for filename, url in covers.items():
    filepath = os.path.join(output_dir, filename)
    print(f"Downloading {filename}...")
    try:
        req = urllib.request.Request(
            url, 
            data=None, 
            headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        )
        with urllib.request.urlopen(req) as response, open(filepath, 'wb') as out_file:
            data = response.read()
            out_file.write(data)
            print(f"Saved to {filepath}")
    except Exception as e:
        print(f"Error downloading {filename}: {e}")
