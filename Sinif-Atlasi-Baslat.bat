@echo off
chcp 65001 >nul
title Direnis Haritasi - Yerel Sunucu
cd /d "%~dp0"

echo.
echo ============================================================
echo   DIRENIS HARITASI - Yerel Sunucu Baslatiliyor
echo ============================================================
echo.
echo   Bu pencere ACIK kalmali. Kapatirsan harita/haber durur.
echo   Uygulamayi kapatmak icin bu pencereyi kapatabilirsin.
echo.

REM --- Python komutunu bul (py -3.11, py, python sirayla) ---
set "PYCMD="
py -3.11 --version >nul 2>&1 && set "PYCMD=py -3.11"
if not defined PYCMD ( py --version >nul 2>&1 && set "PYCMD=py" )
if not defined PYCMD ( python --version >nul 2>&1 && set "PYCMD=python" )
if not defined PYCMD ( python3 --version >nul 2>&1 && set "PYCMD=python3" )

if not defined PYCMD (
    echo   [HATA] Python bulunamadi.
    echo   Python 3 kurulu olmali. https://www.python.org/downloads/
    echo.
    pause
    exit /b 1
)

echo   Python bulundu: %PYCMD%
echo.

REM --- Bos bir port bul (8899'dan basla) ---
set "PORT=8899"
:findport
netstat -an | find ":%PORT% " | find "LISTENING" >nul 2>&1
if %errorlevel%==0 (
    set /a PORT+=1
    goto findport
)

echo   Sunucu portu: %PORT%
echo   Adres: http://localhost:%PORT%/sinif-atlasi.html
echo.
echo   Tarayici birazdan otomatik acilacak...
echo ------------------------------------------------------------
echo.

REM --- Tarayiciyi 2 saniye sonra ac (sunucu ayaga kalksin diye) ---
start "" /b cmd /c "timeout /t 2 >nul & start http://localhost:%PORT%/sinif-atlasi.html"

REM --- HTTP sunucusunu baslat (bu komut pencereyi acik tutar) ---
%PYCMD% -m http.server %PORT% --bind 127.0.0.1

echo.
echo   Sunucu durdu. Pencereyi kapatabilirsin.
pause
