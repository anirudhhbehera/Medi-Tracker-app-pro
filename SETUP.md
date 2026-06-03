# 🚀 Medication Tracker Setup Guide

## Quick Start Instructions

### 1. Frontend Setup (React + Vite)

```bash
cd frontend
npm install
npm run dev
```
**Frontend URL:** `http://localhost:5173`

### 2. Backend Setup (Spring Boot)

**Option A: Using the provided batch file (Recommended)**
```bash
cd backend
run.bat
```

**Option B: Install Maven first**
```bash
# Install Maven
choco install maven -y
# Restart terminal, then:
mvn spring-boot:run
```

**Backend URL:** `http://localhost:8080/api`

### 3. Database Setup (MongoDB Atlas)

1. Create account at [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a cluster
3. Update `backend/src/main/resources/application.yml`:
```yaml
spring:
  data:
    mongodb:
      uri: mongodb+srv://your-username:your-password@cluster0.mongodb.net/medication_tracker
```

## 🎯 Features Available

- ✅ Modern React frontend with animations
- ✅ Glass morphism UI design
- ✅ Medication CRUD operations
- ✅ Reminder scheduling
- ✅ Analytics dashboard
- ✅ AI chat assistant (Gemini)
- ✅ Responsive design
- ✅ Dark/light mode

## 🔧 Troubleshooting

**Maven not found?**
- Use `run.bat` in backend folder
- Or install Maven: `choco install maven -y`

**MongoDB connection issues?**
- Check your connection string
- Ensure IP is whitelisted in Atlas

**Frontend not loading?**
- Run `npm install` in frontend folder
- Check if port 5173 is available

## 📱 Usage

1. Start both frontend and backend
2. Open `http://localhost:5173`
3. Add medications and set reminders
4. Chat with AI assistant for health tips
5. View analytics and track adherence

## 🎨 Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS, Framer Motion
**Backend:** Spring Boot 3.2, Java 17, MongoDB
**AI:** Google Gemini API