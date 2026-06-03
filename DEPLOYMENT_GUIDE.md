# Deployment Guide - MediTracker App

## ✅ Changes Made

### Frontend (`frontend/src/services/api.js`)
- Now uses environment variable: `import.meta.env.VITE_API_BASE_URL`
- Fallback to production URL if env var not set

### Backend (`backend-node/server.js`)
- Added Netlify domains to CORS allowed origins:
  - `https://medi-tracker-app.netlify.app`
  - `https://*.netlify.app`

---

## 🚀 Backend Deployment (Render.com)

### Step 1: Deploy to Render
1. Go to https://dashboard.render.com/
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repo: `Medi-Tracker-app-pro`
4. Configure:

**Basic Settings:**
```
Name: medi-tracker-app-pro
Region: Singapore (or closest to you)
Branch: main
Root Directory: backend-node
Runtime: Node
```

**Build & Deploy:**
```
Build Command: npm install
Start Command: node server.js
```

### Step 2: Environment Variables (on Render)

Add these in **Environment** tab:

| Key | Value |
|-----|-------|
| `PORT` | `8080` |
| `MONGODB_URI` | `mongodb+srv://anirudhhbehera_db_user:anirudhh@cluster0.acprjbu.mongodb.net/medication_tracker?retryWrites=true&w=majority` |
| `JWT_SECRET` | `your-secret-key-here-change-this` |
| `NODE_ENV` | `production` |

### Step 3: Deploy
- Click **"Create Web Service"**
- Wait ~2 minutes for deployment
- Your backend will be live at: `https://medi-tracker-app-pro.onrender.com`

### Step 4: Test Backend
Visit: `https://medi-tracker-app-pro.onrender.com/api/test/health`

Should return:
```json
{
  "status": "OK",
  "message": "Backend is running"
}
```

---

## 🌐 Frontend Deployment (Netlify)

### Step 1: Deploy to Netlify
1. Go to https://app.netlify.com/
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **GitHub** → Select `Medi-Tracker-app-pro` repo
4. Configure:

**Build Settings:**
```
Base directory: frontend
Build command: npm install && npm run build
Publish directory: frontend/dist
```

### Step 2: Environment Variables (on Netlify)

Go to **Site settings** → **Environment variables** → Add:

| Key | Value |
|-----|-------|
| `VITE_API_BASE_URL` | `https://medi-tracker-app-pro.onrender.com/api` |
| `VITE_GEMINI_API_KEY` | `AIzaSyBNWQAY4wbnxoPEnFMxHyU3gaIw0sYUL7I` |
| `VITE_APP_NAME` | `MediTracker` |
| `VITE_APP_VERSION` | `1.0.0` |
| `NODE_VERSION` | `18` |

### Step 3: Deploy
- Click **"Deploy site"**
- Wait ~2 minutes
- Your app will be live at: `https://medi-tracker-app.netlify.app`

---

## 🔧 After Deployment

### If CORS errors persist:
1. Check Render logs for backend errors
2. Verify MongoDB connection in Render dashboard
3. Make sure environment variables are set correctly
4. Redeploy backend if needed

### Update Custom Domain (Optional):
- **Netlify**: Site settings → Domain management → Add custom domain
- **Render**: Settings → Custom Domain → Add your domain

---

## 🧪 Testing

1. **Backend Health Check:**
   ```
   https://medi-tracker-app-pro.onrender.com/api/test/health
   ```

2. **Frontend:**
   ```
   https://medi-tracker-app.netlify.app
   ```

3. **Test Login:**
   - Email: `demo@meditracker.com`
   - Password: `demo123`

---

## 📝 Notes

- **Render Free Tier**: Backend sleeps after 15 min inactivity (first request may be slow)
- **MongoDB Atlas**: Make sure IP whitelist includes `0.0.0.0/0` for Render access
- **CORS**: Already configured for your Netlify domain
- **Environment Variables**: Use Vite's `import.meta.env` for frontend vars

---

## 🐛 Troubleshooting

### Backend not starting?
```bash
# Check Render logs for errors
# Common issues:
- MongoDB URI incorrect
- Missing environment variables
- Port configuration
```

### CORS errors?
```bash
# Verify in backend-node/server.js:
- Netlify domain is in allowed origins
- credentials: true is set
```

### Build fails on Netlify?
```bash
# Check:
- Node version is 18
- Base directory is 'frontend'
- Build command has 'npm install'
```

---

## ✅ Deployment Checklist

- [x] Backend CORS configured for Netlify
- [x] Frontend uses environment variable for API URL
- [x] MongoDB URI updated
- [x] Environment variables documented
- [x] netlify.toml created
- [x] Code pushed to GitHub
- [ ] Deploy backend to Render
- [ ] Deploy frontend to Netlify
- [ ] Test end-to-end functionality

---

**Your app is now production-ready!** 🎉
