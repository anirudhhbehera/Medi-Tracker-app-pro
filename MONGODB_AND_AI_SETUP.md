# 🔧 MongoDB URI & AI API Setup Guide

## 📊 MongoDB URI Information

### Current MongoDB URI in application.yml:
```
mongodb+srv://anirudhhbehera_db_user:anirudhh@cluster0.acprjbu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

### ⚠️ IMPORTANT: This is YOUR MongoDB URI
This URI was found in your project files. It appears to be YOUR personal MongoDB Atlas connection string with:
- **Username**: `anirudhhbehera_db_user`
- **Password**: `anirudhh` (visible in URI - should be changed!)
- **Cluster**: `cluster0.acprjbu.mongodb.net`
- **Database**: `medication_tracker`

### 🔒 Security Recommendations:
1. **Change your password immediately** - it's exposed in the code
2. **Use environment variables** instead of hardcoding credentials
3. **Add `.env` to `.gitignore`** to prevent credential leaks

### How to Get Your Own MongoDB URI:

1. **Go to MongoDB Atlas**: https://cloud.mongodb.com
2. **Sign Up/Login** (Free tier available)
3. **Create a Cluster**:
   - Click "Build a Database"
   - Choose "Free" tier (M0)
   - Select a cloud provider and region
   - Click "Create Cluster"

4. **Create Database User**:
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose username and password
   - Set permissions to "Read and write to any database"

5. **Whitelist IP Address**:
   - Go to "Network Access"
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (0.0.0.0/0) for development

6. **Get Connection String**:
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password

### Example Connection String Format:
```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

---

## 🤖 AI API Integration

### Current Implementation: Hugging Face Inference API

**API Used**: `facebook/blenderbot-400M-distill`
**Endpoint**: `https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill`

### ✅ Why Hugging Face?
- **100% FREE** - No API key required
- **No rate limits** for basic usage
- **Open source models**
- **Dynamic responses** - Real AI, not hardcoded
- **Multiple models available**

### How It Works:
```javascript
const response = await fetch('https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    inputs: userMessage,
    parameters: {
      max_length: 150,
      temperature: 0.7,
      top_p: 0.9
    }
  })
})
```

### Alternative Free AI APIs:

#### 1. **Hugging Face (Current - RECOMMENDED)**
- **URL**: `https://api-inference.huggingface.co/models/`
- **Models Available**:
  - `facebook/blenderbot-400M-distill` (Conversational)
  - `microsoft/DialoGPT-medium` (Dialogue)
  - `google/flan-t5-base` (Question Answering)
- **API Key**: Not required
- **Rate Limit**: Generous free tier

#### 2. **Groq API (Fast & Free)**
- **URL**: `https://api.groq.com/openai/v1/chat/completions`
- **Get Free Key**: https://console.groq.com
- **Models**: `mixtral-8x7b-32768`, `llama2-70b-4096`
- **Speed**: Very fast inference
- **Rate Limit**: 30 requests/minute (free)

#### 3. **Together AI**
- **URL**: `https://api.together.xyz/inference`
- **Get Free Key**: https://together.ai
- **Models**: Multiple open-source LLMs
- **Free Credits**: $25 on signup

#### 4. **Cohere (Trial)**
- **URL**: `https://api.cohere.ai/v1/generate`
- **Get Free Key**: https://cohere.com
- **Free Tier**: 100 requests/minute
- **Good for**: Text generation

### How to Switch AI Models:

#### Option 1: Use Different Hugging Face Model
```javascript
// Change the model in the URL
const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
  // ... same code
})
```

#### Option 2: Add Groq API (Recommended for better responses)
1. Get free API key from https://console.groq.com
2. Update the code:
```javascript
const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_GROQ_API_KEY'
  },
  body: JSON.stringify({
    model: 'mixtral-8x7b-32768',
    messages: [{ role: 'user', content: userMessage }],
    max_tokens: 150
  })
})
```

### Current Fallback System:
1. **Primary**: Hugging Face API (free, no key)
2. **Secondary**: Groq API (if configured)
3. **Fallback**: Local knowledge base (always works)

---

## 🚀 Quick Setup Steps

### For MongoDB:
1. Keep using your current URI OR create new MongoDB Atlas account
2. Update `application.yml` with your connection string
3. Use environment variables for security

### For AI Chat:
1. **Current setup works out of the box** - No API key needed!
2. **Optional**: Get Groq API key for better responses
3. **Fallback**: Built-in medical knowledge base always available

---

## 📝 Environment Variables Setup (Recommended)

### Create `.env` file in backend:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/medication_tracker
AI_API_KEY=your_groq_api_key_here
```

### Update `application.yml`:
```yaml
spring:
  data:
    mongodb:
      uri: ${MONGODB_URI}
```

### Add to `.gitignore`:
```
.env
*.env
application-local.yml
```

---

## ✅ Current Status

- ✅ **MongoDB**: Using your existing Atlas cluster
- ✅ **AI Chat**: Using FREE Hugging Face API (no key needed)
- ✅ **Fallback**: Comprehensive medical knowledge base
- ✅ **Dynamic Responses**: Real AI, not hardcoded answers

---

## 🔐 Security Checklist

- [ ] Change MongoDB password (currently exposed)
- [ ] Move credentials to environment variables
- [ ] Add `.env` to `.gitignore`
- [ ] Enable MongoDB IP whitelist
- [ ] Use strong passwords
- [ ] Never commit credentials to Git

---

**Need Help?**
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com
- Hugging Face API: https://huggingface.co/docs/api-inference
- Groq API: https://console.groq.com/docs
