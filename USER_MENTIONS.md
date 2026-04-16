# User Mentions in Duty Messages

## Nima Qilindi

Navbatchilik xabarlarida userlarni mention qilish funksiyasi qo'shildi. Agar studentning Telegram ID'si mavjud bo'lsa, ularning ismi bosilganda Telegram'da ular mention qilinadi.

## Qanday Ishlaydi

### Telegram Mention Format
```
[Full Name](tg://user?id=TELEGRAM_ID)
```

### Misol
Agar student:
- Full Name: "Rahmatullayeva Shahzoda"
- Telegram ID: "827622887"

Xabarda ko'rinishi:
```
• [Rahmatullayeva Shahzoda](tg://user?id=827622887)
```

User bu ismni bosganda, Telegram'da o'sha user mention qilinadi.

## O'zgartirilgan Fayllar

### 1. bot/src/utils/messages.ts
`formatDutiesMessage()` funksiyasi yangilandi:
- Agar `student.telegramId` mavjud bo'lsa → mention link yaratadi
- Agar yo'q bo'lsa → oddiy text ko'rsatadi

### 2. bot/src/api.ts
Duty group'ga yuborilgan xabarlarda ham mention qo'shildi:
- `generateSimpleMessage()` - oddiy format uchun
- `generateTimedMessage()` - vaqt bo'yicha format uchun

### 3. bot/src/handlers/callbackHandlers.ts
`handleDutyDate()` metodida `parse_mode: 'Markdown'` qo'shildi, shunda mention linklar ishlaydi.

## Xususiyatlar

✅ Telegram ID mavjud bo'lsa → mention link  
✅ Telegram ID yo'q bo'lsa → oddiy text  
✅ Bot xabarlarida ishlaydi  
✅ Guruh xabarlarida ishlaydi  
✅ Markdown format bilan  

## Test Qilish

1. Botda "📆 Haftalik jadval" tugmasini bosing
2. Istalgan kunni tanlang
3. Navbatchilar ro'yxatida ismlarni bosing
4. Agar Telegram ID mavjud bo'lsa, user mention qilinadi

## Eslatma

Telegram ID'lar `students.json` faylida yoki database'da `telegramId` maydonida saqlanadi. Agar student botni ishlatmagan bo'lsa, uning Telegram ID'si bo'lmasligi mumkin.
