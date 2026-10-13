# FinSight 📈

**FinSight** is an interactive, gamified financial education and paper trading platform tailored for young Indians aged 13–25. It demystifies personal finance, compounding, taxation, stock markets, and cryptocurrency through bite-sized interactive lessons, practical financial calculators, a risk-free virtual trading simulator (with ₹10,00,000 in paper cash), and curated market intelligence news.

---

## 🌟 Key Features

1. **Structured Micro-Learning Tracks**:
   - 4 Topics: *Stock Market Basics*, *The Power of Compounding*, *Understanding Taxes in India*, and *Crypto & Digital Assets*.
   - 12 Progressive Lessons with prerequisite locking.
   - Interactive 5-step lesson flow: **Hook** -> **Content Cards** -> **Simulation** -> **Quiz** -> **Reward Receipt**.

2. **Interactive Financial Simulations**:
   - SIP / Compound Growth Calculator with dynamic future value projection charts.
   - In-hand CTC vs Take-Home Salary Breakdown with EPF and Indian tax slabs.
   - Realistic multi-choice scenarios with instant financial outcomes.

3. **Gamification & Engagement Engine**:
   - Experience Points (XP) awarded for lessons, quizzes, simulations, trading, and reading news.
   - Dynamic Level Progression based on non-linear XP thresholds: $50 \times (\text{Level} - 1) \times (\text{Level} + 2)$.
   - Daily Login Streaks anchored to Asia/Kolkata (IST) calendar days, featuring 7-day (+200 XP) and 30-day (+1,000 XP) milestones.
   - 10 Collectible Achievement Badges with bronze, silver, gold, and diamond rarity.

4. **Paper Trading Simulator**:
   - ₹10,00,000 starting virtual cash.
   - 12 Indian assets across 4 classes: Stocks (`RELIANCE`, `TCS`, `INFY`), ETFs (`NIFTYBEES`, `GOLDBEES`, `MON100`), Mutual Funds (`PARAGPARIKH`, `MIRAEASSET`, `HDFCBALANCED`), and Crypto (`BITCOIN`, `ETHEREUM`, `SOLANA`).
   - Real-time simulated price discovery with 24h performance tracking, portfolio allocation bars, and full trade audit logs.
   - Cooldown-protected Portfolio Reset (once every 7 days).

5. **Educational Market News Hub**:
   - 12 curated generic market explainers (Stock Market, Investing, Taxes, Crypto).
   - "Why it matters" takeaways and direct links to related lessons.
   - Daily reading incentives: +25 XP per article read (capped at 5 XP-granting reads / 125 XP per day in IST).

---

## 🏗️ Architecture & Tech Stack

```
FinSight/
├── mobile/                   # React Native / Expo Client (SDK 52)
│   ├── app/                  # Expo Router file-based screens
│   │   ├── (auth)/           # Welcome, Login, Register, Age Group
│   │   ├── (tabs)/           # Home, Learn, News, Portfolio
│   │   ├── lesson/[id].tsx   # 5-Step interactive micro-lesson player
│   │   ├── topic/[slug].tsx  # Track overview & lesson timeline
│   │   ├── portfolio/        # Explore, Asset Detail, Trade Execution, History
│   │   ├── badges.tsx        # Achievement collection gallery
│   │   └── profile.tsx       # Profile, stage preferences & logout
│   └── src/
│       ├── api/              # Axios client with secure token injection
│       ├── components/       # Design system tokens & modularized feature views
│       ├── hooks/            # TanStack Query v5 state & mutation hooks
│       ├── lib/              # SIP, Tax, and date calculation engines
│       └── stores/           # Zustand stores (Auth, Toast, Machine)
│
└── server/                   # Node.js / Express / Prisma API Server
    ├── prisma/               # Schema, migrations & idempotent seed scripts
    └── src/
        ├── config/           # Environment validation (Zod)
        ├── middleware/       # Auth JWT, Rate Limiters, Helmet, Error Sanitizer
        └── modules/          # Auth, User, Learn, Portfolio, Gamification, News
```

---

## 🚀 Quickstart & Local Setup

### Prerequisites
- **Node.js**: v20+ (v22+ recommended)
- **PostgreSQL**: Local or hosted instance (e.g. Supabase, Render)
- **Mobile Device**: Expo Go app (Android/iOS) or Android Studio emulator

---

### Step 1: Start Backend Server

```bash
cd server

# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env and set your DATABASE_URL and JWT_SECRET

# 3. Run database migrations & seed initial data
npx prisma migrate dev
npm run seed

# 4. Start development server
npm run dev
# Server will run at http://0.0.0.0:4000
# Health check: http://localhost:4000/health
```

---

### Step 2: Start Mobile App

```bash
cd mobile

# 1. Install dependencies
npm install

# 2. Configure environment
# In .env (or .env.example):
# For local physical device on Wi-Fi: use your machine's LAN IP (e.g. http://192.168.1.5:4000)
# For Android emulator: use http://10.0.2.2:4000
EXPO_PUBLIC_API_URL=http://localhost:4000

# 3. Start Expo development server
npx expo start
```
Press `a` for Android emulator, or scan the terminal QR code using **Expo Go** on your physical phone.

---

## ⚙️ Environment Variables

### Server (`server/.env`)
| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | HTTP port | `4000` |
| `NODE_ENV` | Environment mode | `development` |
| `DATABASE_URL` | PostgreSQL connection URL | `postgresql://postgres:postgres@localhost:5432/finsight` |
| `JWT_SECRET` | 32+ character JWT secret key | `super_secret_jwt_key_at_least_32_characters_long` |
| `JWT_EXPIRES_IN`| Token lifetime | `7d` |

### Mobile (`mobile/.env`)
| Variable | Description | Example |
| :--- | :--- | :--- |
| `EXPO_PUBLIC_API_URL` | Backend server URL | `http://192.168.1.10:4000` or `https://finsight-api.onrender.com` |

---

## 📡 API Reference Overview

| Endpoint | Method | Auth | Description |
| :--- | :---: | :---: | :--- |
| `/` | GET | Public | Root live status & uptime check |
| `/health` | GET | Public | Health status check |
| `/api/auth/register` | POST | Public | Register new user + calculate age group |
| `/api/auth/login` | POST | Public | Log in with email & password |
| `/api/auth/me` | GET | Bearer | Fetch authenticated user profile & stats |
| `/api/users/me` | PATCH | Bearer | Update user profile / change age group |
| `/api/topics` | GET | Bearer | List learning topics with completion progress |
| `/api/topics/:slug` | GET | Bearer | Get topic detail with lesson timeline & locks |
| `/api/lessons/:id` | GET | Bearer | Fetch lesson content (verifies prerequisites) |
| `/api/lessons/:id/complete` | POST | Bearer | Idempotent lesson completion (+XP & badges) |
| `/api/me/checkin` | POST | Bearer | Daily check-in (+25 XP, streaks, milestones) |
| `/api/badges` | GET | Bearer | Get all badges with user earned status |
| `/api/home` | GET | Bearer | Aggregated home dashboard feed |
| `/api/portfolio` | GET | Bearer | Net worth, allocation, and active holdings |
| `/api/portfolio/assets` | GET | Bearer | Search/filter market instruments |
| `/api/portfolio/assets/:id` | GET | Bearer | Asset details, sparkline series, and holding |
| `/api/portfolio/trade` | POST | Bearer | Execute virtual BUY / SELL order |
| `/api/portfolio/transactions`| GET | Bearer | Paginated trade transaction log |
| `/api/portfolio/reset` | POST | Bearer | Reset portfolio to ₹10,00,000 (7-day cooldown) |
| `/api/news` | GET | Bearer | Paginated financial news with `isRead` flags |
| `/api/news/:id` | GET | Bearer | Article detail with related lesson link |
| `/api/news/:id/read` | POST | Bearer | Mark article read (+25 XP, max 5/day in IST) |

---

## 🧪 Verification & QA

- **TypeScript Typecheck**:
  ```bash
  # Mobile
  cd mobile && npx tsc --noEmit
  # Server
  cd server && npm run build
  ```
- **Expo Quality Audit**:
  ```bash
  cd mobile && npx expo-doctor
  ```
- **End-to-End Test Plan**: See [QA.md](QA.md) for full manual test checklists and state matrices.
- **Deployment & Client Sharing**: See [DEPLOY.md](DEPLOY.md) for Render setup, Expo Tunneling, and Android APK builds.

---

## ⚠️ Known Limitations (MVP Scope)

1. **Simulated Asset Prices**: Asset prices are generated deterministically using mathematical micro-variance models based on base price, volatility, and timestamp. They are not real-time NSE/BSE stock exchange feeds.
2. **Educational Sample News**: News articles are generic educational explainers about plausible market situations. They do not claim specific real-world events, live corporate filings, or exact index levels.
3. **No Password Reset via Email**: Passwords are securely hashed with `bcryptjs`. Email-based reset flows (e.g. SMTP / SendGrid / OTP) are not included in the MVP.
4. **No Remote Push Notifications**: Streaks and daily check-ins are evaluated reactively when the user opens the app or foregrounds it. Remote push notification dispatchers are omitted from this release.
