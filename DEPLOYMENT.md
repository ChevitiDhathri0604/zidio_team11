# IntellMeet – Production Deployment Guide

IntellMeet can be deployed in a few simple steps using **Vercel** or **Render**.

---

## 🚀 Option 1: Deploy to Vercel (Recommended - One-Click Monorepo)

Vercel configuration is pre-built into the repository via [`vercel.json`](file:///C:/Users/CHEVITI%20DHATHRI/.gemini/antigravity/scratch/intellmeet/vercel.json).

### Steps:
1. Go to **[Vercel Dashboard](https://vercel.com/new)** and click **Add New Project**.
2. Select your GitHub repository: **`ChevitiDhathri0604/zidio_team11`**.
3. Set the Environment Variables:
   - `JWT_SECRET`: `your_jwt_secret_key_2026`
   - `OPENAI_API_KEY`: *(Optional for OpenAI analysis capabilities)*
   - `MONGO_URI`: *(Optional - backend auto-switches to Resilient In-Memory DB mode if omitted)*
4. Click **Deploy**. Vercel will automatically build the React frontend and deploy the Node/Express backend APIs serverlessly!

---

## 🚀 Option 2: Deploy to Render (Web Services + Static Site)

### Backend Deployment (Render Web Service)
1. Go to **[Render Dashboard](https://dashboard.render.com/)** -> **New Web Service**.
2. Connect `ChevitiDhathri0604/zidio_team11`.
3. Root Directory: `backend`
4. Build Command: `npm install`
5. Start Command: `node src/server.js`

### Frontend Deployment (Render Static Site)
1. Render -> **New Static Site**.
2. Root Directory: `frontend`
3. Build Command: `npm run build`
4. Publish Directory: `dist`
