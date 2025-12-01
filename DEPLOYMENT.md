# Vercel Deployment Guide

Bu loyiha Vercel platformasida deploy qilish uchun tayyorlangan.

## 📋 Talablar

- Vercel account ([vercel.com](https://vercel.com))
- Git repository (GitHub, GitLab, yoki Bitbucket)
- Supabase project va credentials
- Telegram Bot Token (ixtiyoriy)

## 🚀 Deploy Qilish

### 1. Vercel Dashboard orqali

1. [Vercel Dashboard](https://vercel.com/dashboard) ga kiring
2. "Add New Project" tugmasini bosing
3. Git repositoryingizni tanlang
4. Project Settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (root)
   - **Build Command**: `cd client && npm install && npm run build`
   - **Output Directory**: `client/dist`
   - **Install Command**: `cd client && npm install`

### 2. Environment Variables

Vercel Dashboard > Settings > Environment Variables bo'limida quyidagi o'zgaruvchilarni qo'shing:

#### Client-side (Browser'da ko'rinadi):
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_TELEGRAM_FUNCTION_URL=/api/sentTelegram
```

#### Server-side (Faqat serverless function'da):
```
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_IDS=chat_id1,chat_id2,chat_id3
```

**Muhim**: `TELEGRAM_BOT_TOKEN` va `TELEGRAM_CHAT_IDS` faqat server-side uchun. Ular browser'ga ko'rinmaydi.

### 3. Deploy

"Deploy" tugmasini bosing. Vercel avtomatik ravishda:
- Dependencies o'rnatadi
- Project build qiladi
- Production URL beradi

## 📁 Project Structure

```
.
├── api/
│   └── sentTelegram.js      # Vercel serverless function
├── client/
│   ├── src/                 # React source code
│   ├── dist/                # Build output (generated)
│   └── package.json
├── vercel.json              # Vercel configuration
└── .vercelignore           # Files to ignore
```

## 🔧 Configuration Files

### vercel.json
- Build va routing konfiguratsiyasi
- Security headers
- SPA routing (barcha route'lar index.html ga yo'naltiriladi)

### api/sentTelegram.js
- Telegram xabarlarini yuborish uchun serverless function
- CORS support
- Error handling

## 🌐 Custom Domain

1. Vercel Dashboard > Project > Settings > Domains
2. Domainingizni qo'shing
3. DNS sozlamalarini amalga oshiring

## 🔄 Continuous Deployment

Har safar `main` branch'ga push qilganda, Vercel avtomatik deploy qiladi.

## 🐛 Troubleshooting

### Build xatosi
- `client/package.json` da barcha dependencies borligini tekshiring
- Environment variables to'g'ri sozlanganligini tekshiring

### Telegram function ishlamayapti
- `TELEGRAM_BOT_TOKEN` va `TELEGRAM_CHAT_IDS` environment variables qo'shilganligini tekshiring
- Vercel Dashboard > Functions bo'limida log'larni ko'ring

### Routing muammolari
- `vercel.json` da `rewrites` to'g'ri sozlanganligini tekshiring
- Barcha route'lar `/index.html` ga yo'naltirilishi kerak

## 📝 Notes

- Production build'da console.log'lar avtomatik o'chiriladi
- Static assets cache qilinadi (1 yil)
- Serverless function'lar avtomatik scale qilinadi

## 🆘 Support

Muammo bo'lsa, Vercel documentation'ni ko'ring: [vercel.com/docs](https://vercel.com/docs)

