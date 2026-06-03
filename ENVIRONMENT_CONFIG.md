# 🔧 Environment Configuration - MediTracker App

## ✅ ALL LOCALHOST REFERENCES REMOVED - READY FOR DEPLOYMENT

---

## 📁 Frontend Environment Variables

### File: `frontend/.env`

Create this file in the `frontend/` directory:

```env
# Backend API URL (Production)
VITE_API_BASE_URL=https://medi-tracker-app-pro.onrender.com/api

# Gemini AI API Key
VITE_GEMINI_API_KEY=AIzaSyBNWQAY4wbnxoPEnFMxHyU3gaIw0sYUL7I

# App Configuration
VITE_APP_NAME=MediTracker
VITE_APP_VERSION=1.0.0

# Node Version
NODE_VERSION=18
```

### ⚠️ IMPORTANT: For Netlify Deployment

Add these in **Netlify Dashboard** → **Site settings** → **Environment variables**:

| Variable | Value |
|----------|-------|
| `VITE_API_BASE_URL` | `https://medi-tracker-app-pro.onrender.com/api` |
| `VITE_GEMINI_API_KEY` | `AIzaSyBNWQAY4wbnxoPEnFMxHyU3gaIw0sYUL7I` |
| `VITE_APP_NAME` | `MediTracker` |
| `VITE_APP_VERSION` | `1.0.0` |
| `NODE_VERSION` | `18` |

---

## 📁 Backend Environment Variables

### File: `backend-node/.env`

**CURRENT CONFIGURATION (Already Set):**

```env
PORT=8080
MONGODB_URI=mongodb+srv://anirudhhbehera_db_user:anirudhh@cluster0.acprjbu.mongodb.net/medication_tracker?retryWrites=true&w=majority
JWT_SECRET=meditracker_secret_2024_secure
NODE_ENV=production
```

### ⚠️ IMPORTANT: For Render Deployment

Add these in **Render Dashboard** → **Environment** tab:

| Variable | Value |
|----------|-------|
| `PORT` | `8080` |
| `MONGODB_URI` | `mongodb+srv://anirudhhbehera_db_user:anirudhh@cluster0.acprjbu.mongodb.net/medication_tracker?retryWrites=true&w=majority` |
| `JWT_SECRET` | `meditracker_secret_2024_secure` |
| `NODE_ENV` | `production` |

---

## 🗄️ MongoDB Atlas Configuration

### Database Setup

1. **Database Name:** `medication_tracker`
2. **Collections:** (Auto-created by Mongoose)
   - `users` - User authentication data
   - `medications` - Medication records
   - `reminders` - Reminder settings

### Connection String Breakdown

```
mongodb+srv://anirudhhbehera_db_user:anirudhh@cluster0.acprjbu.mongodb.net/medication_tracker?retryWrites=true&w=majority
```

- **Username:** `anirudhhbehera_db_user`
- **Password:** `anirudhh`
- **Cluster:** `cluster0.acprjbu.mongodb.net`
- **Database:** `medication_tracker`

### ⚠️ IMPORTANT: MongoDB Atlas Network Access

Make sure to whitelist Render's IP addresses:

1. Go to **MongoDB Atlas** → **Network Access**
2. Click **"Add IP Address"**
3. Select **"Allow access from anywhere"** (`0.0.0.0/0`) for Render deployment
4. Click **"Confirm"**

---

## 🔐 Authentication Flow

### How Sign Up/Login Works Now

1. **Sign Up:**
   - Frontend sends: `POST /api/auth/signup` with `{name, email, password}`
   - Backend creates user in MongoDB `users` collection
   - Backend returns JWT token
   - Frontend stores token in `localStorage.authToken`

2. **Login:**
   - Frontend sends: `POST /api/auth/login` with `{email, password}`
   - Backend verifies credentials against MongoDB
   - Backend returns JWT token
   - Frontend stores token in `localStorage.authToken`

3. **Data Storage:**
   - All user data (medications, reminders) stored in MongoDB
   - User ID from JWT token links data to specific user
   - No more localStorage-only storage!

---

## 🚀 Deployment Checklist

### ✅ Fixed Issues:

- [x] Removed ALL localhost references
- [x] Frontend uses production API URL
- [x] Backend authentication connected to MongoDB
- [x] JWT tokens properly stored and used
- [x] CORS configured for Netlify domain
- [x] Environment variables documented
- [x] MongoDB connection string correct

### 📝 Files Changed:

1. `frontend/src/context/AppContext.jsx` - Removed localhost
2. `frontend/src/context/AuthContext.jsx` - Real API authentication
3. `frontend/src/services/api.js` - Token storage fixed
4. `backend-node/models/User.js` - User model created
5. `backend-node/routes/authRoutes.js` - Auth routes created
6. `backend-node/server.js` - Auth routes mounted

---

## 🧪 Testing After Deployment

### 1. Test Backend Health

```bash
curl https://medi-tracker-app-pro.onrender.com/api/test/health
```

Expected: `{"status":"OK","message":"Backend is running"}`

### 2. Test Sign Up

```bash
curl -X POST https://medi-tracker-app-pro.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'
```

Expected: Returns JWT token and user data

### 3. Test Login

```bash
curl -X POST https://medi-tracker-app-pro.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

Expected: Returns JWT token and user data

### 4. Check MongoDB

Go to MongoDB Atlas → Database → Collections → `users`

You should see new user documents when people sign up!

---

## 🐛 Troubleshooting

### If Sign Up/Login Not Working:

1. **Check Render Logs:**
   - Go to Render dashboard → Your service → Logs
   - Look for MongoDB connection errors

2. **Check MongoDB Atlas:**
   - Verify Network Access allows `0.0.0.0/0`
   - Check database name is `medication_tracker`
   - Verify credentials are correct

3. **Check Frontend Console:**
   - Open browser DevTools → Console
   - Look for API call errors
   - Check Network tab for failed requests

4. **Verify Environment Variables:**
   - Netlify: Check all `VITE_*` variables are set
   - Render: Check all backend variables are set

---

## 📊 Data Flow

```
User Signs Up
    ↓
Frontend → POST /api/auth/signup
    ↓
Backend validates & hashes password
    ↓
MongoDB saves user to 'users' collection
    ↓
Backend generates JWT token
    ↓
Frontend stores token in localStorage
    ↓
User creates medications/reminders
    ↓
Frontend sends requests with JWT in headers
    ↓
Backend verifies JWT & saves to MongoDB
    ↓
Data persists in MongoDB Atlas ✅
```

---

## ✨ Key Improvements Made

1. **Real Database Storage:** All user data now in MongoDB (not localStorage)
2. **Secure Authentication:** JWT tokens with bcrypt password hashing
3. **No Localhost:** All API calls use production URLs
4. **Proper Token Management:** Consistent authToken key across app
5. **CORS Fixed:** Netlify domain allowed in backend
6. **Environment Variables:** Properly configured for production

---

## 🎉 Your App is Now Cloud-Ready!

- **Frontend:** https://medi-tracker-app.netlify.app
- **Backend:** https://medi-tracker-app-pro.onrender.com
- **Database:** MongoDB Atlas (cluster0.acprjbu.mongodb.net)

All data is stored in the cloud. No localhost references remain! 🚀
