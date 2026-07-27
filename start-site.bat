@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"

REM ============================================================
REM  Assumes "admin panel" sits right next to this "e commerce
REM  web" folder (e.g. both on the Desktop). If yours is somewhere
REM  else, edit the line below, keeping the quotes.
REM ============================================================
set ADMIN_DIR=%~dp0..\admin panel

echo Checking for existing process on port 4000...
for /f "tokens=5" %%p in ('netstat -ano ^| findstr :4000 ^| findstr LISTENING') do (
  echo Found existing process %%p on port 4000, closing it...
  taskkill /PID %%p /F >nul 2>&1
)

echo Checking for existing process on port 5500...
for /f "tokens=5" %%p in ('netstat -ano ^| findstr :5500 ^| findstr LISTENING') do (
  echo Found existing process %%p on port 5500, closing it...
  taskkill /PID %%p /F >nul 2>&1
)

echo Checking for existing process on port 3000...
for /f "tokens=5" %%p in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
  echo Found existing process %%p on port 3000, closing it...
  taskkill /PID %%p /F >nul 2>&1
)

echo Starting backend server...
start "Backend (port 4000)" cmd /k "node server.js"

echo Starting frontend server...
start "Frontend (port 5500)" cmd /k "python -m http.server 5500"

REM ------------------------------------------------------------
REM  Admin Panel Plus runs as a production build (fast, compressed
REM  + cached) instead of dev mode. The build only needs to happen
REM  once - after that this just reuses dist\ and starts instantly.
REM  It talks to the SAME backend on port 4000 that we just started
REM  above, so no separate backend is needed for it.
REM ------------------------------------------------------------
if exist "%ADMIN_DIR%" (
  if not exist "%ADMIN_DIR%\dist\server.cjs" (
    echo Building Admin Panel Plus for production - first run only, please wait...
    pushd "%ADMIN_DIR%"
    call npm run build
    popd
  )
  echo Starting Admin Panel Plus...
  start "Admin Panel Plus (port 3000)" cmd /k "cd /d "%ADMIN_DIR%" && set NODE_ENV=production && npm start"
) else (
  echo NOTE: "%ADMIN_DIR%" not found - skipping Admin Panel Plus. Edit ADMIN_DIR at the top of this file if it lives somewhere else.
)

echo Waiting for backend server to actually be ready...
REM Checks the real /api/health endpoint (not just "is the port open") so we
REM don't open the site before Mongo/routes have finished loading. Contact
REM form, AI chat, and live chat all call this backend, so opening Chrome
REM too early used to surface as "could not reach the server" on first load.
set BACKEND_READY=0
for /l %%i in (1,1,150) do (
  if !BACKEND_READY! EQU 0 (
    curl.exe -s -o nul -w "%%{http_code}" --max-time 1 http://localhost:4000/api/health > "%TEMP%\_backend_check.txt" 2>nul
    set /p HTTP_CODE=<"%TEMP%\_backend_check.txt"
    if "!HTTP_CODE!"=="200" (
      set BACKEND_READY=1
    ) else (
      ping -n 1 -w 200 127.0.0.1 >nul
    )
  )
)
del "%TEMP%\_backend_check.txt" >nul 2>&1
if !BACKEND_READY! EQU 0 (
  echo WARNING: Backend did not respond within the timeout - opening the site anyway, but some features may fail until it catches up.
)

echo Waiting for frontend server to actually be ready...
set READY=0
for /l %%i in (1,1,150) do (
  if !READY! EQU 0 (
    curl.exe -s -o nul -w "%%{http_code}" --max-time 1 http://localhost:5500/index.html > "%TEMP%\_site_check.txt" 2>nul
    set /p HTTP_CODE=<"%TEMP%\_site_check.txt"
    if "!HTTP_CODE!"=="200" (
      set READY=1
    ) else (
      ping -n 1 -w 200 127.0.0.1 >nul
    )
  )
)
del "%TEMP%\_site_check.txt" >nul 2>&1

set ADMIN_READY=0
if exist "%ADMIN_DIR%" (
  echo Waiting for Admin Panel Plus to actually be ready...
  for /l %%i in (1,1,150) do (
    if !ADMIN_READY! EQU 0 (
      curl.exe -s -o nul -w "%%{http_code}" --max-time 1 http://localhost:3000 > "%TEMP%\_admin_check.txt" 2>nul
      set /p HTTP_CODE=<"%TEMP%\_admin_check.txt"
      if "!HTTP_CODE!"=="200" (
        set ADMIN_READY=1
      ) else (
        ping -n 1 -w 200 127.0.0.1 >nul
      )
    )
  )
  del "%TEMP%\_admin_check.txt" >nul 2>&1
)

echo Clearing old cached files from the dedicated Chrome profile...
if exist "%~dp0.chrome-site-profile\Default\Cache" rd /s /q "%~dp0.chrome-site-profile\Default\Cache" >nul 2>&1
if exist "%~dp0.chrome-site-profile\Default\Code Cache" rd /s /q "%~dp0.chrome-site-profile\Default\Code Cache" >nul 2>&1

echo Opening site (and Admin Panel Plus) in their own dedicated Chrome window...
REM Using a separate --user-data-dir forces a brand new, independent Chrome
REM window/process every time, so it never gets merged into (or hijacked by)
REM any other Chrome window you already have open (e.g. Google AI Studio tabs).
REM Passing both URLs opens them as two tabs in that same new window.
if exist "%ADMIN_DIR%" (
  start "" chrome --new-window --no-first-run --no-default-browser-check --disable-features=SigninPromo,IdentityStatusConsistency --user-data-dir="%~dp0.chrome-site-profile" --disk-cache-size=1 --media-cache-size=1 "http://localhost:5500/index.html" "http://localhost:3000"
) else (
  start "" chrome --new-window --no-first-run --no-default-browser-check --disable-features=SigninPromo,IdentityStatusConsistency --user-data-dir="%~dp0.chrome-site-profile" --disk-cache-size=1 --media-cache-size=1 "http://localhost:5500/index.html"
)

echo.
echo Servers are running in separate windows: Backend, Frontend, and Admin Panel Plus.
echo Close those windows (or press Ctrl+C in each) to stop them.
pause
