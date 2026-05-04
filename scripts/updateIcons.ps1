# Android İkon Güncelleme - Basit Versiyon

Write-Host "Android ikon güncelleme başlıyor..." -ForegroundColor Cyan

# Build klasörlerini temizle
Write-Host "Build klasörleri temizleniyor..." -ForegroundColor Yellow
if (Test-Path "android\app\build") { Remove-Item -Recurse -Force "android\app\build" }
if (Test-Path "android\build") { Remove-Item -Recurse -Force "android\build" }
if (Test-Path "android\.gradle") { Remove-Item -Recurse -Force "android\.gradle" }
Write-Host "Temizlik tamamlandi!" -ForegroundColor Green

# Capacitor sync
Write-Host "Capacitor sync calisiyor..." -ForegroundColor Yellow
npx cap sync android

Write-Host "Islem tamamlandi!" -ForegroundColor Green
Write-Host ""
Write-Host "Simdi Android Studio'da:" -ForegroundColor Yellow
Write-Host "1. File > Invalidate Caches / Restart" -ForegroundColor White
Write-Host "2. Uygulamayi calistirin" -ForegroundColor White
