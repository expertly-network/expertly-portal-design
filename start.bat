@echo off
echo Starting Expertly Local Development Server...

where node >nul 2>nul
if %errorlevel% equ 0 (
    echo Node.js detected. Running using http-server on port 8000...
    npx http-server -p 8000 -c-1
    goto end
)

where python3 >nul 2>nul
if %errorlevel% equ 0 (
    echo Python 3 detected. Running using python3 -m http.server on port 8000...
    python3 -m http.server 8000
    goto end
)

where python >nul 2>nul
if %errorlevel% equ 0 (
    echo Python detected. Running using python -m SimpleHTTPServer on port 8000...
    python -m SimpleHTTPServer 8000
    goto end
)

echo Error: Neither Node.js nor Python was found on your system.
echo Please install Node.js or Python to run this project locally.
pause

:end
