# FinSight — Deployment & Client Sharing Guide

This document describes how to deploy the FinSight backend API server to **Render (Free Tier)**, configure database migrations and seeds, connect the Expo mobile client, and share the app with stakeholders.

---

## Part 1: Deploying Backend to Render (Free Tier)

### 1. Create a PostgreSQL Database on Render
1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** -> **PostgreSQL**.
3. Fill in details:
   - **Name**: `finsight-db`
   - **Database**: `finsight`
   - **User**: `finsight_user`
   - **Region**: Choose closest to target users (e.g., Singapore / Frankfurt)
   - **Plan**: **Free**
4. Click **Create Database**.
5. Once provisioned, copy the **Internal Database URL** (or External Database URL if deploying outside Render).

---

### 2. Create the Web Service on Render
1. In Render Dashboard, click **New +** -> **Web Service**.
2. Connect your Git repository containing the FinSight project.
3. Configure settings:
   - **Name**: `finsight-api`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Build Command**:
     ```bash
     npm install && npx prisma generate && npx prisma migrate deploy && npm run build
     ```
   - **Start Command**:
     ```bash
     npm start
     ```
   - **Plan**: **Free**

---

### 3. Configure Environment Variables
Under the **Environment** tab of your Render Web Service, add the following key-value pairs:

| Variable | Description | Example / Recommended Value |
| :--- | :--- | :--- |
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Service port | `10000` (or leave default set by Render) |
| `DATABASE_URL` | PostgreSQL connection string | *Paste the Render Database URL* |
| `JWT_SECRET` | 64+ char random hex string | *Generate via `openssl rand -hex 32`* |
| `JWT_EXPIRES_IN`| Token validity | `7d` |

---

### 4. Running the Initial Seed
Render's build step runs `prisma migrate deploy`. To populate the database with topics, micro-lessons, gamification badges, trading instruments, and educational news:
1. In the Render Web Service dashboard, go to the **Shell** tab.
2. Run the seed script:
   ```bash
   npm run seed
   ```
3. You will see:
   ```
   🌱 Seeding FinSight Database...
   ✅ Seed complete! 4 topics, 12 lessons, 10 badges, 12 assets, 12 news articles.
   ```

> [!WARNING]
> **Render Free Tier Cold Starts**:
> Render free-tier web services automatically spin down after 15 minutes of inactivity. When a request arrives, the first response takes ~30–50 seconds to wake up.
>
> The FinSight mobile client has an integrated **Server Wakeup Detector** (`serverWakingUp: true` banner on timeout) that automatically prompts users and retries when the server awakens.

---

## Part 2: Connecting the Mobile App

### Update Environment Variable
Once Render assigns your public service URL (e.g. `https://finsight-api.onrender.com`):

1. In the `mobile/` directory, open `.env` (or copy from `.env.example`):
   ```env
   EXPO_PUBLIC_API_URL=https://finsight-api.onrender.com
   ```
2. Verify connectivity (browser me URL open karke ya curl se):
   ```bash
   curl https://finsight-api.onrender.com/
   # Returns: {"success":true,"data":{"status":"ok","message":"FinSight Server is live & connected","timestamp":"...","uptime":12}}
   ```
   Or check `/health`:
   ```bash
   curl https://finsight-api.onrender.com/health
   ```

---

## Part 3: Sharing the App with Clients & Stakeholders

You have two sharing options depending on client technical comfort:

### Option A: Instant Live Testing via Expo Go (Fastest)
Share with anyone who has the free **Expo Go** app installed from the Google Play Store or iOS App Store.

1. Ensure your machine has internet access.
2. In the `mobile/` folder, start Metro bundler with tunnel mode:
   ```bash
   npx expo start --tunnel
   ```
3. A QR code and URL (e.g., `exp://...ngrok.io`) will be printed in your terminal.
4. The client opens **Expo Go** on Android or camera on iOS and scans the QR code. The app bundles and runs live on their device!

---

### Option B: Standalone Android APK Build (No Expo Go Required)
To deliver an installable `.apk` file that clients can install directly onto their Android phone without Expo Go:

#### Step 1: Install & Authenticate EAS CLI
```bash
npm install -g eas-cli
eas login
```

#### Step 2: Configure EAS Build Project
In `mobile/`:
```bash
eas build:configure
```

#### Step 3: Configure `eas.json` for APK Preview
Ensure your `mobile/eas.json` includes an APK preview profile:
```json
{
  "cli": {
    "version": ">= 12.0.0"
  },
  "build": {
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      },
      "env": {
        "EXPO_PUBLIC_API_URL": "https://finsight-api.onrender.com"
      }
    },
    "production": {}
  }
}
```

#### Step 4: Trigger the Cloud Build
Run:
```bash
eas build --profile preview --platform android
```
- EAS will build the `.apk` in the cloud (~5–10 minutes).
- Once finished, EAS provides a direct download link and QR code for the standalone `.apk`.
- Send this link to the client to download and test!
