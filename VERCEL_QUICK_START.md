# Quick Vercel Deployment Guide

## 🚀 Deploy in 5 Minutes

### 1. Get MongoDB Atlas (2 minutes)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up/Sign in
3. Create a free cluster
4. Click "Connect" → "Connect your application"
5. Copy your connection string (looks like: `mongodb+srv://user:pass@cluster.mongodb.net/database`)
6. In "Network Access", click "Add IP Address" → "Allow Access from Anywhere" (0.0.0.0/0)

### 2. Generate JWT Secret (30 seconds)

Run this command or use an online generator:
```bash
openssl rand -base64 32
```

### 3. Deploy to Vercel (2 minutes)

#### Option A: GitHub Integration (Recommended)

1. Push this code to GitHub (you already did!)
2. Go to https://vercel.com and sign in with GitHub
3. Click "Add New Project"
4. Select your repository: `Kshitiz004/React-Native-Dashboard`
5. Click "Import"
6. Add Environment Variables:
   - `MONGO_URI` = your MongoDB connection string
   - `JWT_SECRET` = your generated secret
   - `PORT` = `4000` (optional)
7. Click "Deploy"

#### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy (will prompt for env vars)
vercel

# Add environment variables
vercel env add MONGO_URI
vercel env add JWT_SECRET
vercel env add PORT

# Deploy to production
vercel --prod
```

### 4. Test Your API (30 seconds)

After deployment, you'll get a URL like: `https://your-app.vercel.app`

Test it:
```bash
curl https://your-app.vercel.app/api/health
```

Should return: `{"status":"ok"}`

## 📱 Update Your Mobile App

Edit `config/api.js` in your React Native app:

```javascript
import axios from 'axios';
import { Platform } from 'react-native';

function resolveBaseUrl() {
  if (__DEV__) {
    // Development - use localhost
    if (Platform.OS === 'web') {
      const hostname = window?.location?.hostname || 'localhost';
      return `http://${hostname}:4000`;
    }
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:4000';
    }
    return 'http://localhost:4000';
  }
  
  // Production - use Vercel URL
  return 'https://your-app.vercel.app/api';
}

const API_BASE_URL = resolveBaseUrl();

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API_BASE_URL;
```

## 🗄️ Seed Initial Data

After deployment, you need to create an admin user. Create a temporary seed endpoint or use MongoDB Compass.

**Quick method using MongoDB Atlas UI:**
1. Go to your MongoDB Atlas cluster
2. Click "Browse Collections"
3. Add a document to the `users` collection with:
```json
{
  "name": "Admin",
  "email": "admin@example.com",
  "contact": "1234567890",
  "passwordHash": "$2a$10$YourHashedPasswordHere",
  "roles": ["Admin"]
}
```

Or use bcrypt to hash a password:
```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('yourpassword', 10).then(console.log)"
```

## ✅ You're Done!

Your API is now live and can be accessed by your mobile app.

**Remember to:**
- Replace `your-app.vercel.app` with your actual Vercel URL
- Keep your JWT_SECRET safe and never commit it to Git
- Never share your MONGO_URI publicly

## 🔗 Useful Links

- Vercel Dashboard: https://vercel.com/dashboard
- MongoDB Atlas Dashboard: https://cloud.mongodb.com
- Full deployment guide: See `DEPLOYMENT.md`

