@echo off
REM SmartHostel Setup Script for Windows

echo.
echo 🚀 SmartHostel Setup
echo ====================
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16+
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✓ Node.js %NODE_VERSION%

echo.
echo 📦 Installing dependencies...
call npm install

echo.
echo 📦 Installing workspace dependencies...
call npm install -w backend -w bot -w admin

echo.
echo 🗄️  Setting up database...
cd backend

echo Running migrations...
call npx prisma migrate deploy

echo Seeding sample data...
call npm run db:seed

cd ..

echo.
echo ✅ Setup complete!
echo.
echo 🎯 Next steps:
echo.
echo 1. Start all services:
echo    npm run dev
echo.
echo 2. Or start individually:
echo    Terminal 1: cd backend ^&^& npm run dev
echo    Terminal 2: cd bot ^&^& npm run dev
echo    Terminal 3: cd admin ^&^& npm run dev
echo.
echo 3. Access the system:
echo    Admin Panel: http://localhost:3000
echo    Backend API: http://localhost:3000/api
echo    Bot: Running on Telegram
echo.
echo 📚 Documentation:
echo    - README.md - Full documentation
echo    - QUICKSTART.md - Quick start guide
echo    - IMPLEMENTATION_SUMMARY.md - What's been built
echo.
pause
