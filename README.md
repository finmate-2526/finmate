# Finmate

AI‑powered stock market insights and trading companion. Finmate combines real‑time market data, technical indicators, lightweight predictive heuristics, personalized watchlists, portfolio tracking, preferences, and news—all in a modern React + Tailwind UI with an Express + MongoDB backend.

> Look First / Then Leap — surface context (price action, volatility, trends) before taking action.

## Table of Contents
1. Features
2. Architecture Overview
3. Tech Stack
4. Directory Structure
5. Quick Start (Local Dev)
6. Environment Variables
7. Running Locally (Frontend + Backend)
8. Deployment (Vercel + Render)
9. API Endpoints Summary
10. Authentication & Authorization
11. Portfolio & Watchlist Behavior
12. Indicators & Prediction Logic
13. Troubleshooting
14. Security & Secret Rotation
15. Future Improvements / Roadmap
16. License

---
## 1. Features
- Stock search (Yahoo Finance autocomplete)
- Daily price/volume chart (6‑month range) with technical overlays (RSI, MACD, Bollinger Bands, ATR, SMA/EMA toggles)
- News feed per symbol (Yahoo Finance source formatting + time‑ago)
- User registration & login (JWT based)
- Persistent watchlist & preferences (indicator toggles, layout order, last symbol, etc.)
- Portfolio CRUD (positions with symbol, quantity, average cost, currency, notes)
- Lightweight rule‑based prediction heuristic (7‑day directional bias + rationale disclosure)
- Responsive UI (desktop & mobile support via custom hooks)
- Toast feedback, dialogs, and rich UI components (Radix UI + shadcn/ui derived primitives)
- Centralized API client & auth header injection
- Dev convenience: automatic proxying `/api` calls to local backend, runtime fallbacks for missing build‑time envs.

## 2. Architecture Overview
```
+--------------+       HTTPS        +--------------------+
|   Frontend   | <----------------> |    Backend (API)   |
|  Vite React  |   /api/* requests  | Express + MongoDB  |
+--------------+                    +--------------------+
        |                                    |  
        |  import.meta.env (VITE_*)          |  dotenv (.env / Render env)
        v                                    v
   Browser bundle                      process.env
```
- Frontend served from Vercel (static build). All data requests go to Render API base: `https://finmate-api.onrender.com/api/*`.
- Backend Express service on Render with MongoDB Atlas for persistence.
- CORS allowlist (production domains + localhost dev) ensures secure cross‑origin calls.
- Indicators & prediction logic executed client‑side for responsiveness; raw OHLC data fetched from Yahoo endpoints via backend.

## 3. Tech Stack
- Frontend: Vite, React 18, TypeScript, TailwindCSS, Radix UI components, react-router, react-hook-form, react-query (planned/available), Recharts.
- Backend: Node.js, Express, Mongoose (MongoDB), JWT (jsonwebtoken), bcrypt.
- Data Sources: Yahoo Finance public endpoints (search, chart, news); Finnhub key placeholder.
- Tooling: ESLint, SWC React plugin, Nodemon (dev server), TypeScript configs (separate app/node tsconfigs).

## 4. Directory Structure (excerpt)
```
server/                # Express API
  index.js             # App entry (CORS, routes, health checks)
  db.js                # Mongo connection
  routes/              # auth, watchlist, preferences, portfolio, news, search
  middleware/auth.js   # JWT auth middleware
  models/User.js       # User & embedded data arrays
src/                   # Frontend app
  lib/                 # api.ts, auth.ts, config.ts, indicators.ts, portfolio.ts, rulePredictor.ts
  components/          # UI and feature components (StockChart, NewsCard, etc.)
  pages/               # Route-level components (Dashboard, Login, etc.)
  hooks/               # Custom hooks (use-toast, use-debounce, use-mobile)
  image/               # Static assets
api/                   # (Vercel serverless placeholder: search) — can be removed if not needed
vite.config.ts         # Dev server + proxy config
README.md              # (this file)
```

## 5. Quick Start (Local Dev)
Prerequisites:
- Node.js 18+
- MongoDB Atlas connection string (or local Mongo instance)

Clone & install:
```powershell
git clone https://github.com/finmate-2526/finmate.git
cd finmate
npm install
cd server
npm install
```

## 6. Environment Variables
### Backend (`server/.env` for local, Render dashboard for production)
| Key | Purpose |
|-----|---------|
| MONGO_URI | MongoDB connection string (SRV or mongodb+srv) |
| JWT_SECRET | Long random secret for signing JWT tokens |
| FINNHUB_API_KEY | (Optional) Reserved for future third‑party data |

### Frontend (Vercel Environment Variables)
| Key | Purpose |
|-----|---------|
| VITE_API_BASE_URL | Base origin of backend (no trailing slash). Example: https://finmate-api.onrender.com |

Rules:
- Only variables prefixed with `VITE_` are exposed to the browser bundle.
- Never put `MONGO_URI` or `JWT_SECRET` in Vercel envs — keep them server‑side.
- Redeploy is required after changing build‑time Vercel vars.

## 7. Running Locally
In one terminal (backend):
```powershell
cd server
npm run dev
```
In another (frontend):
```powershell
npm run dev
```
Open: http://localhost:8080

Because of the Vite proxy (`/api` -> http://localhost:4001) you do NOT need to set `VITE_API_BASE_URL` for local development; requests are same‑origin.

## 8. Deployment
### Backend (Render)
1. Create a Render Web Service from `server/` (or separate repo if split).
2. Set environment variables (MONGO_URI, JWT_SECRET, FINNHUB_API_KEY optional).
3. Deploy; verify health at: `https://finmate-api.onrender.com/api/health` (or `/api/healthz`).

### Frontend (Vercel)
1. Set `VITE_API_BASE_URL` (no trailing slash) to backend origin: `https://finmate-api.onrender.com`.
2. Deploy main branch. Runtime fallback auto‑detects `vercel.app` if var missing, but setting it is best.
3. Open DevTools console; you should see `[Finmate] API_BASE: https://finmate-api.onrender.com/api`.

### CORS
Configured allowlist + wildcard for `*.vercel.app` & localhost in `server/index.js`. If you add a custom domain, include it there.

## 9. API Endpoints Summary
Base: `/api`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /health /healthz | None | Health checks |
| GET | /search/:query | None | Symbol autocomplete |
| GET | /stock/:symbol | None | 6‑month daily chart (Yahoo passthrough) |
| GET | /news/:symbol | None | News list with time ago formatting |
| POST | /auth/register | None | Create user; returns token + user |
| POST | /auth/login | None | Authenticate; returns token + user |
| GET | /watchlist | JWT | Fetch watchlist |
| POST | /watchlist | JWT | Add symbol |
| DELETE | /watchlist/:symbol | JWT | Remove symbol |
| GET | /preferences | JWT | Fetch preferences |
| PUT | /preferences | JWT | Update preferences (partial) |
| GET | /portfolio | JWT | List positions |
| POST | /portfolio | JWT | Add a position |
| PUT | /portfolio/:index | JWT | Update position by array index |
| DELETE | /portfolio/:index | JWT | Remove position |

## 10. Authentication & Authorization
- JWT issued on login/register with 7d expiry.
- Stored in `localStorage` (`finmate_token`).
- Requests include `Authorization: Bearer <token>` (see `lib/auth.ts`).
- Middleware (`middleware/auth.js`) verifies token and attaches `req.user`.

## 11. Portfolio & Watchlist Behavior
- Watchlist has unauthenticated fallback using localStorage when no token (see `lib/api.ts` and add/remove logic).
- Portfolio currently requires authentication (no local fallback). Could be extended similarly if needed.

## 12. Indicators & Prediction Logic
Implemented in `lib/indicators.ts` and `lib/rulePredictor.ts`:
- RSI, MACD, Bollinger Bands, ATR, SMA/EMA.
- Prediction heuristic: combines oversold/overbought (RSI), momentum (MACD histogram + slope), mean reversion (Bollinger band position), volatility (ATR%) to produce:
  - trend (up/down)
  - confidence (scaled 15–100%)
  - projected 7‑day move (bounded up to 2%)
  - rationale array for UI transparency.
- Falls back to minimal +0.25% drift when insufficient data (<20 closes).

## 13. Troubleshooting
| Symptom | Cause | Fix |
|---------|-------|-----|
| 404 on `/api/auth/login` | Frontend hitting Vercel `/api` instead of backend base | Ensure `VITE_API_BASE_URL` set & redeploy; confirm console shows correct `API_BASE` |
| CORS block (No 'Access-Control-Allow-Origin') | Origin not in allowlist | Update CORS config in `server/index.js` |
| Double slash `//api` | Trailing slash in env | Remove trailing slash; logic now normalizes |
| Empty indicators | Insufficient price history (<20 bars) | Fetch wider range or accept baseline prediction |
| JWT invalid after redeploy | Secret rotated | Re-login; tokens signed with new `JWT_SECRET` |
| Health endpoint fails | Missing env (MONGO_URI) or network issue | Check Render logs, verify env keys |

## 14. Security & Secret Rotation
- Never commit `.env` files (ignored via `.gitignore`).
- Rotate `JWT_SECRET` & DB credentials if exposed publicly (all existing tokens become invalid).
- Use long random secrets (>= 32 bytes). Example generation (PowerShell):
  ```powershell
  [Guid]::NewGuid().ToString("N") + [Guid]::NewGuid().ToString("N")
  ```
- Consider rate limiting auth endpoints and adding brute‑force protections (future improvement).

## 15. Future Improvements / Roadmap
- Add unit tests for indicators & prediction logic.
- React Query for caching + automatic refetch.
- LocalStorage fallback for portfolio when unauthenticated.
- WebSocket streaming for intraday updates.
- Multi‑tenant user roles (premium indicators).
- Dark/light theme toggle persisted to preferences.
- Rate limiting & request logging structured output.
- Enhanced error boundaries for React components.

## 16. License
Project code: (Add your license choice, e.g. MIT). Current `tools/LICENSE` placeholder—update if needed.

---
### Maintainer Notes
- Add any missing environment variable documentation here as they’re introduced.
- Keep CORS domains tight—avoid `*` in production.
- When modifying API shape, update the API Endpoints table + affected client helpers.

Happy hacking! 🚀
