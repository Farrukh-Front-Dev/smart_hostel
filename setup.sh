#!/bin/bash

# SmartHostel Setup Script
# This script sets up the complete system

set -e

echo "🚀 SmartHostel Setup"
echo "===================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+"
    exit 1
fi

echo "✓ Node.js $(node -v)"

# Check PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL not found. Make sure PostgreSQL is running."
    echo "   Run: createdb smart_hostel"
    echo "   Or: docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15"
fi

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "📦 Installing workspace dependencies..."
npm install -w backend -w bot -w admin

echo ""
echo "🗄️  Setting up database..."
cd backend

# Check if database exists
if ! psql -U postgres -d smart_hostel -c "SELECT 1" 2>/dev/null; then
    echo "Creating database..."
    createdb smart_hostel || echo "Database might already exist"
fi

echo "Running migrations..."
npx prisma migrate deploy

echo "Seeding sample data..."
npm run db:seed

cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo ""
echo "1. Start all services:"
echo "   npm run dev"
echo ""
echo "2. Or start individually:"
echo "   Terminal 1: cd backend && npm run dev"
echo "   Terminal 2: cd bot && npm run dev"
echo "   Terminal 3: cd admin && npm run dev"
echo ""
echo "3. Access the system:"
echo "   Admin Panel: http://localhost:3000"
echo "   Backend API: http://localhost:3000/api"
echo "   Bot: Running on Telegram"
echo ""
echo "📚 Documentation:"
echo "   - README.md - Full documentation"
echo "   - QUICKSTART.md - Quick start guide"
echo "   - IMPLEMENTATION_SUMMARY.md - What's been built"
echo ""
