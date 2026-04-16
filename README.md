# SmartHostel - Yotoqxona Navbatchilik Tizimi

SmartHostel - bu yotoqxona navbatchilik jadvalini boshqarish uchun zamonaviy web va bot tizimi.

## 🚀 Texnologiyalar

### Frontend (Admin Panel)
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Axios** - HTTP client
- **i18n** - 3 tilda (O'zbek, Ingliz, Rus)

### Backend (API Server)
- **Node.js** - Runtime
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Prisma ORM** - Database ORM
- **SQLite** - Database
- **Node-cron** - Scheduled tasks

### Bot (Telegram Bot)
- **Telegraf** - Telegram bot framework
- **TypeScript** - Type safety
- **Axios** - HTTP client

## 📁 Loyiha Strukturasi

```
smarthostel/
├── admin/              # Admin panel (Next.js)
│   ├── components/     # React komponentlar
│   │   ├── common/     # Umumiy komponentlar
│   │   ├── features/   # Feature komponentlar
│   │   │   ├── board/  # Board sahifa komponentlari
│   │   │   ├── peers/  # Peers boshqaruvi
│   │   │   └── students/ # Students boshqaruvi
│   │   ├── layout/     # Layout komponentlar
│   │   └── ui/         # UI komponentlar
│   ├── lib/            # Utilities va helpers
│   ├── pages/          # Next.js sahifalar
│   └── styles/         # Global styles
│
├── backend/            # Backend API (Express)
│   ├── prisma/         # Database schema va migrations
│   ├── src/
│   │   ├── routes/     # API routes
│   │   ├── services/   # Business logic
│   │   └── cron/       # Scheduled tasks
│   └── dist/           # Compiled JavaScript
│
└── bot/                # Telegram bot (Telegraf)
    ├── src/
    │   ├── api.ts      # Bot API logic
    │   ├── commands.ts # Bot commands
    │   └── index.ts    # Bot entry point
    └── dist/           # Compiled JavaScript
```

## 🎨 Dizayn Xususiyatlari

- **3D Design System** - Zamonaviy 3D shadow va border effektlar
- **Dark Mode** - To'liq dark mode qo'llab-quvvatlash
- **Responsive Design** - Mobile va desktop uchun optimallashtirilgan
- **Animated Background** - Squares animated background
- **Gradient Colors** - Chiroyli gradient ranglar
- **Multilingual** - 3 tilda (O'zbek, Ingliz, Rus)

## 🔑 Asosiy Funksiyalar

### Admin Panel
- ✅ Dashboard - Umumiy statistika
- ✅ Peerlar boshqaruvi - CRUD operatsiyalar
- ✅ Navbatchilik jadvali - Avtomatik generatsiya
- ✅ Sozlamalar - Tizim sozlamalari
- ✅ Public Board - Ochiq navbatchilik jadvali

### Telegram Bot
- ✅ Navbatchilik jadvalini ko'rish
- ✅ Bugun/Ertaga navbatchilar
- ✅ Rasm bilan xabar yuborish
- ✅ 2 xil format (Simple va Timed)

### Backend API
- ✅ RESTful API
- ✅ Avtomatik navbatchilik generatsiyasi
- ✅ Rotation queue tizimi
- ✅ Settings management
- ✅ Cron jobs

## 🛠️ O'rnatish

Batafsil o'rnatish yo'riqnomasi uchun [SETUP.md](SETUP.md) faylini ko'ring.

## 📝 Litsenziya

Bu loyiha shaxsiy foydalanish uchun yaratilgan.

## 👨‍💻 Muallif

SmartHostel - School 21 yotoqxonasi uchun maxsus ishlab chiqilgan.
