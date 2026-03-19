# SmartHostel Admin Frontend

## Umumiy Ma'lumot
Next.js + React + TypeScript + Tailwind CSS + Lucide React icons bilan qurilgan admin panel.

## Tillar
- **Uzbek (O'z)** - Asosiy til
- **English (Eng)** - Ingliz tili
- **Russian (Rus)** - Rus tili

Tilni navbar-dagi Globe icon orqali o'zgartirish mumkin.

## Sahifalar

### 1. Dashboard (/)
- SmartHostel Admin sarlavhasi
- Soat vaqt real-time ko'rinadi
- Statistika: Jami o'quvchilar, Faol, Muzlatilgan
- Students va Duties sahifalariga o'tish tugmalari

### 2. Students (/students)
- O'quvchilarni boshqarish
- **Amallar:**
  - Qavat bo'yicha filterlash (1-4)
  - O'quvchi qo'shish (username, floor, note)
  - O'quvchini tahrirlash
  - O'quvchini o'chirish
  - Muzlatish/Muzlatishni bekor qilish
- Jadvaldagi ko'rinish: Taxallus, Qavat, Izoh, Holati, Amallar

### 3. Duties (/duties)
- Navbatchilikni ko'rish
- **Filtrlash:**
  - Bugun (Today)
  - Ertaga (Tomorrow)
  - Sanani tanlash (Select Date)
- Qavat bo'yicha ko'rinadi (1-4)
- Har qavat uchun tayinlangan o'quvchilar ro'yxati

## Texnologiyalar
- **Next.js 14** - Framework
- **React 18** - UI Library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Axios** - API requests

## Fayllar Tuzilishi
```
admin/
├── pages/
│   ├── _app.tsx          # Language context provider
│   ├── _document.tsx     # Document setup
│   ├── index.tsx         # Dashboard
│   ├── students.tsx      # Students management
│   └── duties.tsx        # Duties view
├── lib/
│   ├── api.ts            # API client
│   └── i18n.ts           # Translations (uz, en, ru)
├── styles/
│   └── globals.css       # Global styles
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
└── postcss.config.js
```

## API Endpoints
- `GET /api/students` - Barcha o'quvchilar
- `POST /api/students` - O'quvchi qo'shish
- `PUT /api/students/:id` - O'quvchini yangilash
- `DELETE /api/students/:id` - O'quvchini o'chirish
- `POST /api/students/:id/freeze` - Muzlatish
- `POST /api/students/:id/unfreeze` - Muzlatishni bekor qilish
- `GET /api/duties/today` - Bugungi navbatchilik
- `GET /api/duties/tomorrow` - Ertagi navbatchilik
- `GET /api/duties/date/:date` - Sanaga ko'ra navbatchilik

## Environment Variables
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Ishga Tushirish
```bash
cd admin
npm install
npm run dev
```
Sayt: `http://localhost:3002`

## Xususiyatlar
✅ 3 tilda lokalizatsiya (Uz, En, Ru)
✅ Real-time soat vaqt
✅ Responsive design
✅ Lucide React icons
✅ Error handling
✅ Loading states
✅ Floor filtering
✅ Student CRUD operations
✅ Freeze/Unfreeze functionality
✅ Duties view by floor
