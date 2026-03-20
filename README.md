# Job Placement Portal — JobConnect

A full-stack job placement portal built with **Node.js/Express** (backend) and **React** (frontend).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router, Axios, Lucide Icons |
| Backend | Node.js, Express, MongoDB/Mongoose |
| Auth | JWT (Access + Refresh tokens), bcrypt |
| File Storage | Cloudinary (resumes, logos) |
| Email | Nodemailer (SMTP) |
| Validation | Zod |
| Build Tool | Vite |

## Features

- **Students**: Browse/search jobs, apply with cover letter, track applications, save jobs, manage profile & resume
- **Recruiters**: Post jobs, view applicants, update application statuses, manage company profile
- **Admin**: Dashboard stats, user management, recruiter approval workflow
- **Security**: Helmet, CORS, rate limiting, JWT with refresh token rotation, RBAC middleware

## Project Structure

```
portal/
├── server/                 # Backend API
│   ├── config/             # DB & Cloudinary config
│   ├── controllers/        # Route handlers
│   ├── middleware/          # Auth, RBAC, error handling, upload, rate limit
│   ├── models/             # Mongoose schemas
│   ├── routes/             # Express routes
│   ├── services/           # Email, Cloudinary, Notification services
│   ├── validators/         # Zod validation schemas
│   └── server.js           # Entry point
├── client/                 # React frontend
│   ├── src/
│   │   ├── api/            # Axios instance with interceptors
│   │   ├── components/     # Shared UI components
│   │   ├── context/        # Auth context
│   │   ├── hooks/          # Custom hooks
│   │   └── pages/          # Page components (auth, student, recruiter, admin)
│   └── index.html
└── README.md
```

## Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Backend
```bash
cd server
cp .env.example .env       # Edit with your credentials
npm install
npm run dev                 # Starts on port 5000
```

### Frontend
```bash
cd client
npm install
npm run dev                 # Starts on port 5173 (proxies API to :5000)
```

### Environment Variables

See `server/.env.example` for the full list. Key variables:
- `MONGO_URI` — MongoDB connection string
- `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` — Token secrets
- `CLOUDINARY_*` — Cloudinary credentials (for file uploads)
- `EMAIL_*` — SMTP credentials (for verification/reset emails)
- `CLIENT_URL` — Frontend URL for email links

## Deployment

### Backend (Render)
1. Create a **Web Service** on [Render](https://render.com)
2. Root directory: `server`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add all env variables from `.env.example`

### Frontend (Vercel)
1. Import project on [Vercel](https://vercel.com)
2. Root directory: `client`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add env variable: `VITE_API_URL=https://your-backend.onrender.com`

### Frontend (Netlify)
1. Import project on [Netlify](https://netlify.com)
2. Base directory: `client`
3. Build command: `npm run build`
4. Publish directory: `client/dist`
5. Add `_redirects` file (already included)

## API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | Public | Register user |
| POST | `/api/auth/login` | Public | Login |
| GET | `/api/auth/me` | Bearer | Get current user |
| GET | `/api/jobs` | Public | List jobs (search, filter, paginate) |
| POST | `/api/jobs` | Recruiter | Post a job |
| POST | `/api/applications/:jobId` | Student | Apply to job |
| GET | `/api/admin/stats` | Admin | Dashboard stats |

*See route files for the complete list.*
