# SmartHostel - Complete Hostel Duty Management System

A modern, full-stack hostel duty management system built with Next.js, Node.js, Express, Telegram Bot, and SQLite.

## 🎯 Overview

SmartHostel is a comprehensive solution for managing hostel duties with:
- **Admin Dashboard** - Modern SaaS-style interface
- **Telegram Bot** - Automated duty posting and workflow
- **REST API** - Complete backend with duty scheduling
- **Database** - SQLite with Prisma ORM
- **Multi-language** - Uzbek, English, Russian support

## ✨ Key Features

### Admin Dashboard
- 📊 Real-time analytics dashboard
- 👥 Student management (CRUD operations)
- 📅 Duty scheduling and viewing
- 🔒 Freeze/Unfreeze students
- 🌍 3-language support (Uz, En, Ru)
- 📱 Responsive design (Mobile, Tablet, Desktop)
- 🎨 Modern SaaS UI with Tailwind CSS
- ⚡ Real-time clock display

### Telegram Bot
- 📢 Daily duty posting at 08:00
- 🤖 Interactive duty workflow
- 📸 Photo collection (3+ photos)
- ✅ Confirmation system
- 📝 Session management
- 🔄 Fair rotation algorithm

### Backend API
- 🔌 RESTful API endpoints
- 📦 Complete CRUD operations
- ⏰ Cron scheduler for daily duties
- 🔄 Fair rotation queue system
- 🛡️ Error handling and validation
- 📊 Database migrations

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation & Setup

```bash
# 1. Install all dependencies
npm install

# 2. Setup database
npm run db:migrate
npm run db:seed

# 3. Start all services
npm run dev
```

### Access Services
- **Admin Panel:** http://localhost:3002
- **Backend API:** http://localhost:3000
- **Bot:** Port 3001 (listening)

## 📁 Project Structure

```
SmartHostel/
├── backend/              # Node.js + Express API
│   ├── src/
│   │   ├── routes/       # API endpoints
│   │   ├── services/     # Business logic
│   │   ├── cron/         # Scheduler
│   │   └── index.ts      # Entry point
│   ├── prisma/
│   │   ├── schema.prisma # Database schema
│   │   ├── seed.ts       # Sample data
│   │   └── migrations/   # DB migrations
│   └── package.json
├── bot/                  # Telegram Bot
│   ├── src/
│   │   ├── index.ts      # Bot entry
│   │   ├── commands.ts   # Bot commands
│   │   ├── dutyWorkflow.ts # Duty workflow
│   │   ├── api.ts        # API endpoints
│   │   └── middleware.ts # Bot middleware
│   └── package.json
├── admin/                # Next.js Admin Panel
│   ├── pages/            # Page components
│   ├── components/       # Reusable components
│   ├── lib/              # Utilities (API, i18n)
│   ├── styles/           # Global styles
│   └── package.json
└── package.json          # Root workspace
```

## 🛠️ Technology Stack

### Frontend
- **Next.js 14** - React framework
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **Prisma** - ORM
- **SQLite** - Database
- **node-cron** - Scheduler

### Bot
- **Telegraf.js** - Telegram bot framework
- **Express** - API server
- **Axios** - HTTP client

## 📊 Database Schema

### Student
- id, username (unique), floor (1-4), note, telegramId, isFrozen, frozenReason

### Duty
- id, date (unique), status (pending/posted/completed)

### DutyStudent
- id, dutyId, studentId, floor

### Report
- id, studentId, dutyDate, photoCount, status, notes

### RotationQueue
- id, studentId (unique), floor, lastAssignedDate, priority

### BotSession
- id, studentId, dutyDate, step, nickname, photoCount, status

## 🎨 UI Components

### Reusable Components
- **Sidebar** - Navigation with active states
- **Navbar** - Top bar with search, clock, language switcher
- **Layout** - Main layout wrapper
- **StatCard** - Analytics cards
- **DataTable** - Sortable table
- **Badge** - Status indicators
- **Button** - Reusable buttons
- **Modal** - Dialog component

## 🌐 Languages

- **Uzbek (O'z)** - Default language
- **English (Eng)** - English interface
- **Russian (Rus)** - Russian interface

Switch languages using the Globe icon in the navbar.

## 📱 Responsive Design

- **Mobile** - Single column, collapsed sidebar
- **Tablet** - 2 columns, sidebar visible
- **Desktop** - Full layout with all features

## 🔐 Security Features

- TypeScript type safety
- Input validation
- Error handling
- Secure API integration
- Session management
- CORS enabled

## 📊 Sample Data

Database includes:
- **25 Students** across 4 floors
- **7 Days** of duty assignments
- **Real Nicknames** from provided list
- **Sample Reports** for testing

### Students by Floor
- **Floor 1:** 6 students
- **Floor 2:** 6 students
- **Floor 3:** 7 students
- **Floor 4:** 6 students

## 🚀 API Endpoints

### Students
```
GET    /api/students              # Get all students
GET    /api/students?floor=1      # Get by floor
POST   /api/students              # Create student
PUT    /api/students/:id          # Update student
DELETE /api/students/:id          # Delete student
POST   /api/students/:id/freeze   # Freeze student
POST   /api/students/:id/unfreeze # Unfreeze student
```

### Duties
```
GET /api/duties/today             # Today's duties
GET /api/duties/tomorrow          # Tomorrow's duties
GET /api/duties/date/:date        # Duties by date
```

## 🎯 Features

### Dashboard
- ✅ Real-time statistics
- ✅ Student count (total, active, frozen)
- ✅ Today's duties count
- ✅ Quick actions
- ✅ Recent activity feed

### Students Management
- ✅ Add/Edit/Delete students
- ✅ Freeze/Unfreeze functionality
- ✅ Floor filtering
- ✅ Search functionality
- ✅ Status badges
- ✅ Modal forms

### Duties Management
- ✅ View today's duties
- ✅ View tomorrow's duties
- ✅ Custom date selection
- ✅ Floor-based grouping
- ✅ Student assignment display

### Settings
- ✅ Account settings
- ✅ Notification preferences
- ✅ Security settings
- ✅ System information

## 🔧 Commands

### Development
```bash
npm run dev              # Start all services
npm run build            # Build all services
npm run db:migrate       # Run migrations
npm run db:seed          # Seed database
```

### Individual Services
```bash
cd backend && npm run dev    # Backend only
cd bot && npm run dev        # Bot only
cd admin && npm run dev      # Admin only
```

## 📝 Environment Variables

### Backend (.env)
```
DATABASE_URL="file:./dev.db"
PORT=3000
TELEGRAM_BOT_TOKEN=your_token
TELEGRAM_GROUP_ID=your_group_id
BOT_API_URL=http://localhost:3001
```

### Bot (.env)
```
TELEGRAM_BOT_TOKEN=your_token
TELEGRAM_GROUP_ID=your_group_id
BACKEND_API_URL=http://localhost:3000
BOT_PORT=3001
```

### Admin (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
lsof -ti:3000 | xargs kill -9
lsof -ti:3002 | xargs kill -9
```

### Database Issues
```bash
cd backend
rm prisma/dev.db
npm run db:migrate
npm run db:seed
```

### Module Not Found
```bash
npm install
```

## 📚 Documentation

- **QUICK_START.md** - 5-minute quick start guide
- **SETUP.md** - Complete setup guide
- **admin/FRONTEND.md** - Frontend documentation
- **admin/UI_REDESIGN.md** - UI redesign details
- **admin/REDESIGN_SUMMARY.md** - Redesign summary

## 🎉 Features Summary

✅ Complete hostel duty management
✅ Telegram bot integration
✅ Modern admin dashboard
✅ 3-language support
✅ Real-time updates
✅ Student management
✅ Duty scheduling
✅ Fair rotation algorithm
✅ Responsive design
✅ Production-ready code
✅ TypeScript type safety
✅ Comprehensive error handling

## 📞 Support

For issues or questions:
1. Check logs in each service
2. Verify environment variables
3. Ensure all ports are available
4. Check database connection
5. Review documentation

## 📄 License

This project is part of SmartHostel system.

## 🙏 Credits

Built with modern technologies and best practices for hostel management.

---

**Ready to get started?** See [QUICK_START.md](QUICK_START.md) for a 5-minute setup guide!
