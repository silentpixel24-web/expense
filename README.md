# Mosque Expenditure & Financial Transparency Management System

A full-stack platform for mosque income tracking, expense management, public financial transparency, and committee administration.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, React, Tailwind CSS, Chart.js |
| Backend | Node.js, Express, REST API |
| Database | MongoDB (Mongoose) |
| Auth | JWT, role-based access control |
| Deploy | Vercel (frontend), Render/Railway (API), MongoDB Atlas (DB) |

## Features

- **Authentication & roles:** Admin, Treasurer, Accountant, Viewer
- **Dashboard:** Balance, monthly income/expense, charts, recent transactions
- **Income management:** All mosque income sources, receipts, attachments, auto receipt numbers
- **Expenditure management:** Categories, approval workflow, recurring expenses, bill uploads
- **Public transparency portal:** Monthly summaries, category breakdowns, notice board, UPI QR donations
- **Reports:** PDF and Excel export, pie/bar/trend charts
- **Additional modules:** Assets, employees, events, maintenance logs, inventory
- **Audit trail:** Hash-chained activity logs
- **i18n:** English, Tamil, Arabic (UI labels)

## Project Structure

```
expense/
├── backend/          # Express API
├── frontend/         # Next.js app
├── DATABASE_SCHEMA.md
└── README.md
```

## Deployment & Atlas setup

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for:
- MongoDB Atlas step-by-step
- Docker local MongoDB
- Render / Railway API deploy
- Vercel frontend deploy
- Mosque name & currency customization

## Quick Start (Local)

### Prerequisites

- Node.js 18+
- MongoDB — **either** Docker (`docker compose up -d` in project root) **or** [MongoDB Atlas](https://www.mongodb.com/atlas)

### 1. Install dependencies

```bash
cd expense
npm run install:all
```

### 2. Configure backend

```bash
cd backend
copy .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mosque_finance
JWT_SECRET=your-long-random-secret-key-here
FRONTEND_URL=http://localhost:3000
```

### 3. Seed sample data

```bash
npm run seed
```

### 4. Configure frontend

```bash
cd ../frontend
copy .env.example .env.local
```

`.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 5. Run development servers

Terminal 1 – API:

```bash
cd backend
npm run dev
```

Terminal 2 – Frontend:

```bash
cd frontend
npm run dev
```

- **App:** http://localhost:3000
- **API:** http://localhost:5000/api
- **Public portal:** http://localhost:3000/public

## Demo Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@mosque.local | admin123 |
| Treasurer | treasurer@mosque.local | treasurer123 |
| Accountant | accountant@mosque.local | accountant123 |
| Viewer | viewer@mosque.local | viewer123 |

## API Endpoints (Summary)

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/auth/login | Public |
| GET | /api/public/summary | Public |
| GET | /api/public/notices | Public |
| GET | /api/dashboard | Authenticated |
| CRUD | /api/income | Treasurer+ |
| CRUD | /api/expenditure | Treasurer+ |
| PATCH | /api/expenditure/:id/approve | Admin, Treasurer |
| GET | /api/reports/pdf, /excel | Authenticated |
| GET | /api/activity-logs | Admin only |

## Production Deployment

### Frontend (Vercel)

1. Import `frontend` folder to Vercel
2. Set `NEXT_PUBLIC_API_URL=https://your-api.onrender.com/api`
3. Deploy

### Backend (Render / Railway)

1. Deploy `backend` as Node web service
2. Set environment variables from `.env.example`
3. Use MongoDB Atlas connection string for `MONGODB_URI`
4. Set `FRONTEND_URL` to your Vercel domain

### MongoDB Atlas

1. Create free cluster
2. Add database user and network access (0.0.0.0/0 for cloud APIs)
3. Copy connection string to `MONGODB_URI`

### Optional Integrations

Configure in backend `.env`:

- `UPI_MERCHANT_ID` – UPI donation QR
- `WHATSAPP_API_URL` – WhatsApp notifications
- `SMS_API_KEY` – SMS alerts to committee
- `DONATION_GATEWAY_KEY` – Online payment gateway

## Security Notes

- Change all demo passwords before production
- Use a strong `JWT_SECRET` (32+ random characters)
- Enable HTTPS in production
- Restrict MongoDB Atlas IP access when possible
- Run daily backups via Atlas or scheduled exports

## License

MIT – Built for mosque communities and financial transparency.
