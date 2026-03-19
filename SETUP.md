# SmartHostel - Complete Setup Guide

## 📋 Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- SQLite (included with Node.js)

## 🚀 Quick Start (All Services)

### 1. Install Dependencies

```bash
# Root level - install all workspaces
npm install

# Or install each workspace separately:
cd backend && npm install
cd ../bot && npm install
cd ../admin && npm install
```

### 2. Setup Database

```bash
cd backend

# Run migrations
npm run db:migrate

# Seed database with sample data
npm run db:seed
```

### 3. Start All Services

**Option A: Start all at once (from root)**
```bash
npm run dev
```

**Option B: Start individually in separate terminals**

Terminal 1 - Backend:
```bash
cd backend
npm run dev
# Runs on http://localhost:3000
```

Terminal 2 - Bot:
```bash
cd bot
npm run dev
# Runs on port 3001
```

Terminal 3 - Admin Panel:
```bash
cd admin
npm run dev
# Runs on http://localhost:3002
```

## 📊 Services Overview

### Backend (Node.js + Express)
- **Port:** 3000
- **URL:** http://localhost:3000
- **API Endpoints:**
  - `GET /api/students` - Get all students
  - `POST /api/students` - Create student
  - `PUT /api/students/:id` - Update student
  - `DELETE /api/students/:id` - Delete student
  - `POST /api/students/:id/freeze` - Freeze student
  - `POST /api/students/:id/unfreeze` - Unfreeze student
  - `GET /api/duties/today` - Get today's duties
  - `GET /api/duties/tomorrow` - Get tomorrow's duties
  - `GET /api/duties/date/:date` - Get duties by date

### Telegram Bot
- **Port:** 3001
- **Features:**
  - Daily duty posting at 08:00
  - Interactive duty workflow
  - Photo collection
  - Session management

### Admin Panel (Next.js)
- **Port:** 3002
- **URL:** http://localhost:3002
- **Features:**
  - Modern SaaS dashboard
  - Student management
  - Duties viewing
  - Settings page
  - 3-language support (Uz, En, Ru)

## 🔧 Environment Variables

### Backend (.env)
```
DATABASE_URL="file:./dev.db"
PORT=3000
NODE_ENV=development
TELEGRAM_BOT_TOKEN=8669076779:AAESJ44FZOuouMBdDsdXeUGU5T1PpgCDQ94
TELEGRAM_GROUP_ID=-3724627457
BOT_API_URL=http://localhost:3001
```

### Bot (.env)
```
TELEGRAM_BOT_TOKEN=8669076779:AAESJ44FZOuouMBdDsdXeUGU5T1PpgCDQ94
TELEGRAM_GROUP_ID=-3724627457
BACKEND_API_URL=http://localhost:3000
BOT_PORT=3001
NODE_ENV=development
```

### Admin (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 📁 Project Structure

```
SmartHostel/
├── backend/              # Node.js + Express API
│   ├── src/
│   │   ├── index.ts
│   │   ├── routes/
│   │   ├── services/
│   │   └── cron/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.ts
│   │   └── migrations/
│   └── package.json
├── bot/                  # Telegram Bot
│   ├── src/
│   │   ├── index.ts
│   │   ├── commands.ts
│   │   ├── dutyWorkflow.ts
│   │   ├── api.ts
│   │   └── middleware.ts
│   └── package.json
├── admin/                # Next.js Admin Panel
│   ├── pages/
│   │   ├── _app.tsx
│   │   ├── index.tsx
│   │   ├── students.tsx
│   │   ├── duties.tsx
│   │   └── settings.tsx
│   ├── components/
│   │   ├── Sidebar.tsx
│   │   ├── Navbar.tsx
│   │   ├── Layout.tsx
│   │   ├── StatCard.tsx
│   │   ├── DataTable.tsx
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   └── Modal.tsx
│   ├── lib/
│   │   ├── api.ts
│   │   └── i18n.ts
│   └── package.json
└── package.json          # Root workspace
```

## ✅ Verification Checklist

After starting all services, verify:

1. **Backend Health**
   ```bash
   curl http://localhost:3000/health
   # Should return: {"status":"ok","timestamp":"..."}
   ```

2. **Admin Panel**
   - Open http://localhost:3002
   - Should see modern dashboard
   - Language switcher working
   - Real-time clock visible

3. **Database**
   - 25 students seeded
   - 4 floors with students
   - Duties generated for 7 days

4. **Bot**
   - Check logs for "Telegram bot started"
   - Should be listening for messages

## 🎯 Key Features

### Dashboard
- Real-time statistics
- Student count (total, active, frozen)
- Today's duties count
- Quick actions
- Recent activity feed

### Students Management
- Add/Edit/Delete students
- Freeze/Unfreeze functionality
- Floor filtering
- Search functionality
- Status badges

### Duties Management
- View today's duties
- View tomorrow's duties
- Custom date selection
- Floor-based grouping
- Student assignment display

### Settings
- Account settings
- Notification preferences
- Security settings
- System information

## 🌐 Languages Supported
- **Uzbek (O'z)** - Default
- **English (Eng)**
- **Russian (Rus)**

Switch languages using the Globe icon in the navbar.

## 📱 Responsive Design
- Mobile optimized
- Tablet friendly
- Desktop full-featured
- Collapsible sidebar

## 🔐 Security Features
- TypeScript type safety
- Input validation
- Error handling
- Secure API integration
- Session management

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 3002
lsof -ti:3002 | xargs kill -9
```

### Database Issues
```bash
cd backend
# Reset database
rm prisma/dev.db
npm run db:migrate
npm run db:seed
```

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

### Bot Not Connecting
- Check TELEGRAM_BOT_TOKEN is correct
- Verify TELEGRAM_GROUP_ID is correct
- Check internet connection
- Verify backend is running

## 📊 Database Schema

### Student
- id (PK)
- username (unique)
- floor (1-4)
- note (optional)
- telegramId (optional)
- isFrozen (boolean)
- frozenReason (optional)

### Duty
- id (PK)
- date (unique)
- status (pending, posted, completed)

### DutyStudent
- id (PK)
- dutyId (FK)
- studentId (FK)
- floor

### Report
- id (PK)
- studentId (FK)
- dutyDate
- photoCount
- status (pending, approved, rejected)

### RotationQueue
- id (PK)
- studentId (FK, unique)
- floor
- lastAssignedDate
- priority

### BotSession
- id (PK)
- studentId (FK)
- dutyDate
- step (nickname, photos, confirmation)
- nickname
- photoCount
- status (active, completed, cancelled)

## 🚀 Production Deployment

### Backend
```bash
cd backend
npm run build
npm start
```

### Bot
```bash
cd bot
npm run build
npm start
```

### Admin
```bash
cd admin
npm run build
npm start
```

## 📞 Support

For issues or questions:
1. Check logs in each service
2. Verify environment variables
3. Ensure all ports are available
4. Check database connection
5. Verify API endpoints

## 📝 Notes

- Default admin user: admin@smarthostel.com
- Cron job runs daily at 08:00 for duty generation
- Bot posts duties to Telegram group automatically
- Database is SQLite (dev.db in backend/prisma/)
- All data is seeded on first run

## ✨ Features Summary

✅ Complete hostel duty management system
✅ Telegram bot integration
✅ Modern admin dashboard
✅ 3-language support
✅ Real-time updates
✅ Student management
✅ Duty scheduling
✅ Fair rotation algorithm
✅ Responsive design
✅ Production-ready code
