# Deployment Guide

Step-by-step setup for **MongoDB Atlas**, **local MongoDB (Docker)**, **Render/Railway API**, and **Vercel frontend**.

---

## Part 1 — MongoDB Atlas (Cloud Database)

### 1. Create a free cluster

1. Go to [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Create a **free M0** cluster (choose a region close to your users, e.g. Mumbai `ap-south-1`)
3. Wait until cluster status is **Active**

### 2. Create database user

1. **Database Access** → **Add New Database User**
2. Authentication: **Password**
3. Username: `mosque_admin` (or your choice)
4. Generate a strong password — save it securely
5. Role: **Atlas admin** (or **readWrite** on `mosque_finance` only for production hardening)

### 3. Allow network access

1. **Network Access** → **Add IP Address**
2. For development: **Allow Access from Anywhere** (`0.0.0.0/0`)  
   *(Required for Render/Railway/Vercel serverless; restrict IPs later if you have fixed servers)*

### 4. Get connection string

1. **Database** → **Connect** → **Drivers**
2. Copy the connection string, e.g.:

```
mongodb+srv://mosque_admin:<password>@cluster0.xxxxx.mongodb.net/mosque_finance?retryWrites=true&w=majority
```

3. Replace `<password>` with your actual password (URL-encode special characters like `@` → `%40`)

### 5. Add to backend `.env`

```env
MONGODB_URI=mongodb+srv://mosque_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/mosque_finance?retryWrites=true&w=majority
```

### 6. Seed the database

```powershell
cd c:\expense\backend
npm run seed
```

You should see demo login credentials printed in the terminal.

---

## Part 2 — Local MongoDB (Docker, no Atlas)

If you prefer running MongoDB on your PC:

```powershell
cd c:\expense
docker compose up -d
```

Keep `backend/.env` as:

```env
MONGODB_URI=mongodb://localhost:27017/mosque_finance
```

Then seed:

```powershell
cd backend
npm run seed
```

---

## Part 3 — Customize mosque name & currency

### Backend (`backend/.env`)

```env
MOSQUE_NAME=Al-Noor Masjid
CURRENCY=INR
CURRENCY_SYMBOL=₹
UPI_MERCHANT_ID=alnoor.masjid@upi
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_MOSQUE_NAME=Al-Noor Masjid
NEXT_PUBLIC_MOSQUE_NAME_TA=அல்-நூர் மசூதி
NEXT_PUBLIC_MOSQUE_NAME_AR=مسجد النور
NEXT_PUBLIC_CURRENCY=INR
NEXT_PUBLIC_DEFAULT_LOCALE=en
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Supported currencies: `INR`, `USD`, `GBP`, `AED`, `SAR`, `MYR`

Restart both servers after changing env files.

---

## Part 4 — Deploy API to Render

### Option A: Blueprint (render.yaml)

1. Push this repo to GitHub
2. [Render Dashboard](https://dashboard.render.com/) → **New** → **Blueprint**
3. Connect the repo — Render reads `render.yaml`
4. Set these manually when prompted:
   - `MONGODB_URI` — your Atlas connection string
   - `FRONTEND_URL` — `https://your-app.vercel.app` (set after Vercel deploy)
   - `MOSQUE_NAME` — your mosque name
   - `UPI_MERCHANT_ID` — optional

### Option B: Manual web service

1. **New** → **Web Service** → connect GitHub repo
2. **Root Directory:** `backend`
3. **Build Command:** `npm install`
4. **Start Command:** `npm start`
5. **Environment variables:** copy from `backend/.env.example`

Your API URL will be like: `https://mosque-finance-api.onrender.com`

Health check: `https://mosque-finance-api.onrender.com/api/health`

> **Note:** Render free tier sleeps after inactivity. First request may take ~30s.

### Seed production database

From your PC (with Atlas URI in local `.env`):

```powershell
cd backend
# Ensure MONGODB_URI points to Atlas
npm run seed
```

---

## Part 5 — Deploy frontend to Vercel

1. Push repo to GitHub
2. [vercel.com](https://vercel.com) → **Add New Project** → import repo
3. **Root Directory:** `frontend`
4. **Environment Variables:**

| Name | Value |
|------|--------|
| `NEXT_PUBLIC_API_URL` | `https://mosque-finance-api.onrender.com/api` |
| `NEXT_PUBLIC_MOSQUE_NAME` | `Al-Noor Masjid` |
| `NEXT_PUBLIC_CURRENCY` | `INR` |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | `en` |

5. Deploy

### Connect API ↔ Frontend

In **Render**, update:

```env
FRONTEND_URL=https://your-project.vercel.app
```

Redeploy the API so CORS allows your Vercel domain.

---

## Part 6 — Deploy API to Railway (alternative)

1. [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub**
2. Set root to `backend/` (or use `backend/railway.toml`)
3. Add variables from `backend/.env.example`
4. Generate public domain → use as `NEXT_PUBLIC_API_URL` on Vercel

---

## Part 7 — Production checklist

- [ ] Change all demo passwords (`npm run seed` only for initial setup)
- [ ] Set strong `JWT_SECRET` (32+ random characters)
- [ ] Set `NODE_ENV=production` on API host
- [ ] Configure `FRONTEND_URL` for CORS
- [ ] Enable MongoDB Atlas **backup** (Atlas → Backup for paid tiers, or export scripts)
- [ ] Set real `UPI_MERCHANT_ID` for donations
- [ ] Optional: `WHATSAPP_API_URL`, `SMS_API_KEY` for notifications

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `ECONNREFUSED 27017` | Start Docker Mongo or fix Atlas URI |
| CORS error on login | Set `FRONTEND_URL` on API to exact Vercel URL (no trailing slash) |
| 401 on API calls | Check `NEXT_PUBLIC_API_URL` includes `/api` |
| Render slow first load | Free tier cold start — upgrade or use Railway |
| Atlas auth failed | URL-encode password in connection string |

---

## Quick reference — run locally

```powershell
# Terminal 1 — MongoDB (Docker)
cd c:\expense
docker compose up -d

# Terminal 2 — API
cd c:\expense\backend
npm run dev

# Terminal 3 — Frontend
cd c:\expense\frontend
npm run dev
```

Open http://localhost:3000 — login with `admin@mosque.local` / `admin123`
