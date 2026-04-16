# Deployment Guide

## Local Development

```bash
# Install dependencies
npm install

# Run all services (backend, bot, admin)
npm run dev

# Build all services
npm run build

# Start production (backend + bot)
npm start
```

## Render Deployment (Backend + Bot)

### Using render.yaml (Recommended)

1. Push code to GitHub
2. Go to [render.com](https://render.com)
3. Click "New +" → "Blueprint"
4. Connect GitHub repository
5. Select `render.yaml`
6. Add environment variables:
   - `DATABASE_URL` - PostgreSQL connection string
   - `TELEGRAM_BOT_TOKEN` - Your Telegram bot token
   - `TELEGRAM_DUTY_GROUP_ID` - Duty group ID
   - `TELEGRAM_PAYMENT_GROUP_ID` - Payment group ID

### Manual Setup

1. Create new Web Service on Render
2. Connect GitHub repository
3. Settings:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     ```
     NODE_ENV=production
     DATABASE_URL=postgresql://...
     TELEGRAM_BOT_TOKEN=...
     TELEGRAM_DUTY_GROUP_ID=...
     TELEGRAM_PAYMENT_GROUP_ID=...
     BACKEND_API_URL=http://localhost:3003
     BOT_URL=http://localhost:3004
     ```

## Vercel Deployment (Admin Panel)

1. Go to [vercel.com](https://vercel.com)
2. Import GitHub repository
3. Settings:
   - **Framework**: Next.js
   - **Root Directory**: `admin`
   - **Environment Variables**:
     ```
     NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
     ```

## Environment Variables

### Backend (.env)
```
PORT=3003
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host/dbname
BACKEND_URL=https://your-app.onrender.com
BOT_URL=https://your-app.onrender.com
```

### Bot (.env)
```
TELEGRAM_BOT_TOKEN=your_token_here
TELEGRAM_DUTY_GROUP_ID=-1003724627457
TELEGRAM_PAYMENT_GROUP_ID=-1003849393283
BACKEND_API_URL=https://your-backend.onrender.com
BOT_URL=https://your-app.onrender.com
BOT_PORT=3004
NODE_ENV=production
```

### Admin (.env.local)
```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

## Database Setup

1. Create PostgreSQL database on Render or Railway
2. Get connection string
3. Add to `DATABASE_URL` environment variable
4. Run migrations:
   ```bash
   npm run db:migrate
   ```

## Monitoring

Check service status in Admin Panel → Settings:
- Backend status
- Bot status
- Response times
- Last checked timestamp

Services are checked every 30 seconds automatically.

## Troubleshooting

### Bot offline
- Check `TELEGRAM_BOT_TOKEN` is valid
- Verify network connectivity
- Check Telegram API status

### Backend offline
- Check database connection
- Verify `DATABASE_URL` is correct
- Check logs in Render dashboard

### Admin can't connect
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check CORS settings in backend
- Verify backend is running
