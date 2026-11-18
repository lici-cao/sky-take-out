@echo off
chcp 65001 >nul 2>&1
title Sky Take Out Desktop
cd /d "%~dp0"

set "JAVA=%~dp0runtime\bin\java.exe"
set "JAR=%~dp0app\sky-take-out.jar"

if not exist "%JAVA%" (
  echo [ERROR] Bundled Java runtime not found: %JAVA%
  pause & exit /b 1
)
if not exist "%JAR%" (
  echo [ERROR] Application jar not found: %JAR%
  pause & exit /b 1
)

set "PORT=8080"
if defined SKY_PORT set "PORT=%SKY_PORT%"

echo ============================================================
echo  Sky Take Out - Desktop Edition
echo  Starting server, please wait about 10-20 seconds...
echo  Browser will open automatically at http://localhost:%PORT%/
echo  (Set SKY_PORT to start on another port, e.g. set SKY_PORT=8081)
echo ============================================================
echo.

start "" /min powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 13; Start-Process 'http://localhost:%PORT%/'"

"%JAVA%" -Xms128m -Xmx512m -Dfile.encoding=UTF-8 -Dspring.profiles.active=desktop -jar "%JAR%" --server.port=%PORT%

echo.
echo Server stopped. Press any key to exit.
pause >nul
