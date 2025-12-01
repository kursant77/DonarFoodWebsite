# DonerFood Website

Modern va professional DonerFood restorani vebsayti. React, TypeScript, Vite, va Supabase bilan qurilgan.

## 🚀 Features

- 🍽️ Mahsulotlar katalogi
- 🛒 Online savat
- 📍 Geolocation asosida yetkazib berish
- 📱 Responsive dizayn
- 🔐 Admin panel
- 📊 Analytics dashboard
- 💬 Telegram integratsiyasi

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Backend**: Supabase
- **Routing**: Wouter
- **State Management**: React Query
- **Deployment**: Vercel

## 📦 Installation

```bash
# Dependencies o'rnatish
cd client
npm install

# Development server ishga tushirish
npm run dev

# Production build
npm run build
```

## ⚙️ Environment Variables

`.env` fayl yaratish va quyidagi o'zgaruvchilarni qo'shing:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_TELEGRAM_FUNCTION_URL=/api/sentTelegram
```

## 🚀 Deployment

Vercel'da deploy qilish uchun [DEPLOYMENT.md](./DEPLOYMENT.md) faylini ko'ring.

## 📝 License

Private project
