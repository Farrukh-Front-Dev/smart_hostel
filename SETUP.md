# SmartHostel - O'rnatish Yo'riqnomasi

## Talablar

- Node.js 18+ 
- npm yoki yarn
- Git

## 1. Loyihani Klonlash

```bash
git clone <repository-url>
cd smarthostel
```

## 2. Dependencies O'rnatish

### Root
```bash
npm install
```

### Admin Panel
```bash
cd admin
npm install
```

### Backend
```bash
cd backend
npm install
```

### Bot
```bash
cd bot
npm install
```

## 3. Environment Variables

### Backend (.env)
```env
DATABASE_URL="file:./prisma/dev.db"
PORT=3000
BOT_API_URL=http://localhost:3001
```

### Bot (.env)
```env
BOT_TOKEN=your_telegram_bot_token
BACKEND_API_URL=http://localhost:3000
TELEGRAM_GROUP_ID=your_telegram_group_id
```

### Admin (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 4. Database Setup

```bash
cd backend
npx prisma migrate dev
npx prisma db seed
```

## 5. Build

### Backend
```bash
cd backend
npm run build
```

### Bot
```bash
cd bot
npm run build
```

### Admin
```bash
cd admin
npm run build
```

## 6. Ishga Tushirish

### Development Mode

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Bot:
```bash
cd bot
npm run dev
```

Terminal 3 - Admin:
```bash
cd admin
npm run dev
```

### Production Mode

Terminal 1 - Backend:
```bash
cd backend
npm start
```

Terminal 2 - Bot:
```bash
cd bot
npm start
```

Terminal 3 - Admin:
```bash
cd admin
npm start
```

## 7. Login Ma'lumotlari

Default login:
- Login: `admin`
- Password: `sevara`

Yoki:
- Login: `rrangesi`
- Password: `02110542`

## 8. Portlar

- Admin Panel: http://localhost:3002
- Backend API: http://localhost:3000
- Bot API: http://localhost:3001
- Public Board: http://localhost:3002/board

## Muammolarni Hal Qilish

### Database xatosi
```bash
cd backend
rm -rf prisma/dev.db
npx prisma migrate dev
npx prisma db seed
```

### Port band bo'lsa
Portlarni .env fayllarida o'zgartiring.

### Bot ishlamasa
- BOT_TOKEN to'g'riligini tekshiring
- TELEGRAM_GROUP_ID to'g'riligini tekshiring
- Botni guruhga admin qilib qo'shing
