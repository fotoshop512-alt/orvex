from PIL import Image, ImageOps, ImageDraw
import os

def reconstruct_perfect_icon():
    """
    görsel2.jpg dosyasından başlayarak harfleri koruyup, 
    dama tahtasını ve köşe süslemelerini temizler.
    """
    source = "görsel2.jpg"
    if not os.path.exists(source):
        print(f"Hata: {source} bulunamadı!")
        return

    # 1. GÖRSELİ YÜKLE VE HAZIRLA
    img = Image.open(source).convert("RGBA")
    w, h = img.size
    
    # 2. LOGO BLOĞUNU TESPİT ET (Dama tahtasından ayır)
    # Koyu mavi olan kısımları alacağız.
    # Ters çevrilmiş grayscale'de logo çok parlak çıkar.
    gray = ImageOps.grayscale(img)
    inverted = ImageOps.invert(gray)
    # Eşik 160: Sadece koyu olan logo bloğunu ve harfleri yakalar. 
    # Gri dama tahtası silinir.
    mask = inverted.point(lambda p: 255 if p > 160 else 0)
    
    bbox = mask.getbbox()
    if not bbox:
        print("Logo bloğu tespit edilemedi.")
        return
        
    # Sadece logo bloğunu kırp
    logo_block = img.crop(bbox)
    lw, lh = logo_block.size
    
    # 3. KÖŞELERDEKİ BEYAZ SÜSLEMELERİ SİL
    # Kırpılmış logo bloğunun köşelerindeki beyaz pikselleri maviye boyayacağız.
    pixels = logo_block.load()
    # Tema rengini merkezden bir yerden al (kuşun olmadığı bir yer)
    theme_color = (32, 24, 101, 255) 
    
    # Köşe tarama sınırı (120 piksel - Harflere girmemek için dar tutuyoruz)
    scan_limit = 125
    corners = [
        (0, 0, scan_limit, scan_limit, 0, 0),                       # SL
        (lw - scan_limit, 0, lw, scan_limit, lw, 0),                 # SR
        (0, lh - scan_limit, scan_limit, lh, 0, lh),                 # AL
        (lw - scan_limit, lh - scan_limit, lw, lh, lw, lh)          # AR
    ]

    for x_start, y_start, x_end, y_end, cx, cy in corners:
        for y in range(y_start, y_end):
            for x in range(x_start, x_end):
                r, g, b, a = pixels[x, y]
                # Köşeye olan dairesel mesafe
                dist = ((x - cx)**2 + (y - cy)**2)**0.5
                # Sadece en uçtaki beyaz süslemeleri hedefle (dist < 185)
                if dist < 185:
                    brightness = (r + g + b) / 3
                    if brightness > 180: # Bariz beyaz çizgiler
                        pixels[x, y] = theme_color

    # 4. YUVARLATILMIŞ ŞIK BİR KARE OLUŞTUR
    final_size = 1024
    result = Image.new("RGBA", (final_size, final_size), (0, 0, 0, 0))
    
    # Logo bloğunu 1024'e sığacak şekilde büyüt/küçült
    logo_block_resized = logo_block.resize((final_size, final_size), Image.Resampling.LANCZOS)
    
    # Yuvarlatılmış maske uygula (Köşe beyazlığı kalmasın diye)
    round_mask = Image.new("L", (final_size, final_size), 0)
    draw = ImageDraw.Draw(round_mask)
    draw.rounded_rectangle((0, 0, final_size, final_size), radius=int(final_size * 0.18), fill=255)
    
    result.paste(logo_block_resized, (0, 0), round_mask)

    # 5. KAYIT
    result.save("ikon.png", "PNG") # Ana kaynağı kurtarıyoruz
    result.save("public/icon.png", "PNG")
    result.save("public/ikon.png", "PNG")
    result.save("public/icon_fg.png", "PNG")
    
    # JPG
    jpg = Image.new("RGB", (final_size, final_size), theme_color[:3])
    jpg.paste(result, (0, 0), result)
    jpg.save("public/icon.jpg", "JPEG", quality=95)
    
    # Android BG
    bg = Image.new("RGB", (final_size, final_size), theme_color[:3])
    bg.save("public/icon_bg.png", "PNG")

    print("✅ İkon ORİJİNAL görselden (görsel2.jpg) yeniden oluşturuldu. Harfler tam, köşeler temiz!")

if __name__ == "__main__":
    reconstruct_perfect_icon()
