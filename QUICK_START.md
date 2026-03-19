# SmartHostel - Quick Start (5 Minutes)

## 🚀 Start Everything in 3 Steps

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Setup Database
```bash
npm run db:migrate
npm run db:seed
```

### Step 3: Start All Services
```bash
npm run dev
```

## ✅ Services Running

After running `npm run dev`, you should see:

```
Backend:  http://localhost:3000
Bot:      Port 3001 (listening)
Admin:    http://localhost:3002
```

## 🌐 Access Admin Panel

Open your browser and go to:
```
http://localhost:3002
```

### Login Info
- No login required (demo mode)
- Default language: Uzbek
- Switch language using Globe icon in navbar

## 📊 What You'll See

### Dashboard
- 4 stat cards (Total, Active, Frozen, Today's Duties)
- Quick actions
- Recent activity

### Students Page
- List of 25 seeded students
- Search and filter by floor
- Add/Edit/Delete students
- Freeze/Unfreeze functionality

### Duties Page
- View today's duties
- View tomorrow's duties
- Select custom date
- See students assigned per floor

### Settings Page
- Account settings
- Notification preferences
- Security settings
- System information

## 🌍 Languages
- **O'z** - Uzbek (Default)
- **Eng** - English
- **Rus** - Russian

## 🎯 Sample Data

Database is pre-seeded with:
- **25 Students** across 4 floors
- **7 Days** of duty assignments
- **Real Nicknames** from provided list
- **Sample Reports** for testing

### Students by Floor
- **Floor 1:** jarrusha, albabeck, gemmachi, lirabelmaxterz, efiraralkinfyn, travelsadrimor
- **Floor 2:** gladysjo, christib, lexamartyrion, kosvaldo, kybrelsamzter, dalvioquentisjarvick
- **Floor 3:** oskarhar, skytejal, jayeland, blytherm, onzarilexon, triveranymphadal, vekorlix
- **Floor 4:** visionti, spinneta, johnieer, elvinarkrestalfyn, lorzyndraquestor, lymorbrivian

## 🔧 Individual Service Commands

### Backend Only
```bash
cd backend
npm run dev
# http://localhost:3000
```

### Bot Only
```bash
cd bot
npm run dev
# Port 3001
```

### Admin Only
```bash
cd admin
npm run dev
# http://localhost:3002
```

## 🐛 Common Issues

### Port Already in Use
```bash
# Kill process on port
lsof -ti:3000 | xargs kill -9
lsof -ti:3002 | xargs kill -9
```

### Database Error
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

## 📱 Features to Try

1. **Add Student**
   - Go to Students page
   - Click "Add Student"
   - Fill form and save

2. **Freeze Student**
   - Click "Freeze" button
   - Enter reason
   - Student becomes inactive

3. **View Duties**
   - Go to Duties page
   - Switch between Today/Tomorrow/Custom Date
   - See students assigned per floor

4. **Change Language**
   - Click Globe icon in navbar
   - Select O'z, Eng, or Rus
   - UI updates instantly

5. **Check Real-time Clock**
   - Clock in navbar updates every second
   - Shows HH:MM:SS format

## 🎨 UI Features

- **Modern Dashboard** - Analytics with stat cards
- **Responsive Design** - Works on mobile, tablet, desktop
- **Collapsible Sidebar** - Click chevron to collapse/expand
- **Search** - Search students by name
- **Filters** - Filter by floor (1-4)
- **Sorting** - Click column headers to sort
- **Status Badges** - Green (Active), Red (Frozen)
- **Modal Forms** - Add/Edit students in modal
- **Animations** - Smooth transitions and hover effects

## 📊 API Endpoints

### Students
- `GET /api/students` - Get all students
- `GET /api/students?floor=1` - Get students by floor
- `POST /api/students` - Create student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student
- `POST /api/students/:id/freeze` - Freeze student
- `POST /api/students/:id/unfreeze` - Unfreeze student

### Duties
- `GET /api/duties/today` - Today's duties
- `GET /api/duties/tomorrow` - Tomorrow's duties
- `GET /api/duties/date/:date` - Duties by date

## 🔐 Security

- TypeScript for type safety
- Input validation
- Error handling
- Secure API integration

## 📝 Next Steps

1. ✅ Start all services
2. ✅ Access admin panel
3. ✅ Explore features
4. ✅ Try adding/editing students
5. ✅ View duties
6. ✅ Change language
7. ✅ Check settings

## 🎉 You're Ready!

Everything is set up and running. Enjoy using SmartHostel! 🚀

For detailed setup guide, see `SETUP.md`
