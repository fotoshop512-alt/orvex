# Android İkon Değişikliği Uygulama Scripti
# Bu script Android uygulamasındaki ikon değişikliklerini uygulamak için gerekli tüm adımları yapar

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Android İkon Güncelleme Scripti" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Cihazdan uygulamayı kaldır
Write-Host "1. Cihazdan uygulama kaldırılıyor..." -ForegroundColor Yellow
adb uninstall com.ydspro.app 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ Uygulama kaldırıldı" -ForegroundColor Green
} else {
    Write-Host "   ⚠ Uygulama bulunamadı veya zaten kaldırılmış" -ForegroundColor Gray
}
Write-Host ""

# 2. Build klasörlerini temizle
Write-Host "2. Build klasörleri temizleniyor..." -ForegroundColor Yellow
Remove-Item -Recurse -Force "android\app\build" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "android\build" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "android\.gradle" -ErrorAction SilentlyContinue
Write-Host "   ✓ Build klasörleri temizlendi" -ForegroundColor Green
Write-Host ""

# 3. Capacitor sync
Write-Host "3. Capacitor sync çalıştırılıyor..." -ForegroundColor Yellow
npx cap sync android
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ Capacitor sync tamamlandı" -ForegroundColor Green
} else {
    Write-Host "   ✗ Capacitor sync başarısız!" -ForegroundColor Red
    exit 1
}
Write-Host ""

# 4. Gradle clean
Write-Host "4. Gradle clean çalıştırılıyor..." -ForegroundColor Yellow
Set-Location android
.\gradlew clean
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ Gradle clean tamamlandı" -ForegroundColor Green
} else {
    Write-Host "   ✗ Gradle clean başarısız!" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Set-Location ..
Write-Host ""

# 5. İkon dosyalarını kontrol et
Write-Host "5. İkon dosyaları kontrol ediliyor..." -ForegroundColor Yellow
$iconFiles = Get-ChildItem -Path "android\app\src\main\res\mipmap-*\ic_launcher.png" -ErrorAction SilentlyContinue
if ($iconFiles.Count -gt 0) {
    Write-Host "   ✓ $($iconFiles.Count) ikon dosyası bulundu" -ForegroundColor Green
    foreach ($file in $iconFiles) {
        $size = [math]::Round($file.Length / 1KB, 2)
        Write-Host "     - $($file.Directory.Name): $size KB" -ForegroundColor Gray
    }
} else {
    Write-Host "   ✗ İkon dosyaları bulunamadı!" -ForegroundColor Red
}
Write-Host ""

# Tamamlandı
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "İşlem Tamamlandı!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Sonraki Adımlar:" -ForegroundColor Yellow
Write-Host "1. Android Studio'yu açın" -ForegroundColor White
Write-Host "2. File > Invalidate Caches / Restart... seçin" -ForegroundColor White
Write-Host "3. Invalidate and Restart'a tıklayın" -ForegroundColor White
Write-Host "4. Gradle sync tamamlandıktan sonra uygulamayı çalıştırın" -ForegroundColor White
Write-Host ""
Write-Host "Alternatif: Doğrudan APK build etmek için:" -ForegroundColor Yellow
Write-Host "   cd android" -ForegroundColor Cyan
Write-Host "   .\gradlew assembleDebug" -ForegroundColor Cyan
Write-Host "   adb install -r app\build\outputs\apk\debug\app-debug.apk" -ForegroundColor Cyan
Write-Host ""
