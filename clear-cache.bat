@echo off
REM Clear node_modules/.vite cache
echo Clearing Vite cache...
rmdir /s /q node_modules\.vite 2>nul
echo Cache cleared successfully!
echo.
echo Restart your dev server now with: npm run dev
pause
