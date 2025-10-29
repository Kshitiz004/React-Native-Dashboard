# How to Run the Healthcare App on Your Laptop

## Step-by-Step Instructions

### Prerequisites Check
- ✅ Node.js installed (you're using v20.19.5)
- ✅ MongoDB running (either local or Atlas)

### Step 1: Start Backend Server (Terminal 1)

Open PowerShell or Command Prompt and run:

```bash
cd D:\Study\Kshitiz\Healthcare\server
npm run dev
```

You should see:
```
Connected to MongoDB
Server listening on http://localhost:4000
```

**✅ Backend is ready!**

---

### Step 2: Start Mobile App (Terminal 2)

Open a NEW PowerShell or Command Prompt window:

```bash
cd D:\Study\Kshitiz\Healthcare\mobile
npm start
```

You'll see the Expo developer tools. Choose your platform:

---

### Step 3: Choose How to View the App

#### Option A: Run on Android Emulator (Recommended)
1. Install Android Studio and create an emulator
2. In the Expo terminal, press `a`
3. The app will open in the Android emulator

#### Option B: Run on iOS Simulator (Mac only)
1. Install Xcode
2. In the Expo terminal, press `i`
3. The app will open in the iOS simulator

#### Option C: Run on Web Browser (Easiest for Testing)
1. In the Expo terminal, press `w`
2. The app will open in your default web browser

#### Option D: Run on Your Phone with Expo Go
1. Install "Expo Go" app from App Store/Play Store
2. Scan the QR code shown in the Expo terminal
3. App will open on your phone

---

### Step 4: Test the App

**Login with:**
- Email: `admin@example.com`
- Password: `admin123`

**What to test:**
1. ✅ Login screen appears
2. ✅ After login, you see Home tab
3. ✅ As Admin, you see Users and Roles tabs
4. ✅ Create a new user with "Employee" role
5. ✅ Logout
6. ✅ Login as the new Employee user
7. ✅ You should only see the Home tab (no Users/Roles)

---

### Troubleshooting

#### Backend not connecting?
- Check MongoDB is running: `mongosh` or check MongoDB service
- Check port 4000 is not in use
- Verify `.env` file exists in server folder

#### Mobile app not starting?
- Make sure you're in the `mobile` folder
- Run `npm install` if dependencies are missing
- Clear cache: `npx expo start -c`

#### Can't connect from phone?
- Make sure phone and computer are on the same WiFi
- Check firewall isn't blocking the connection
- Try tunnel mode: `npx expo start --tunnel`

---

### Quick Command Reference

```bash
# Terminal 1 - Backend
cd D:\Study\Kshitiz\Healthcare\server
npm run dev

# Terminal 2 - Mobile (open in new window)
cd D:\Study\Kshitiz\Healthcare\mobile
npm start

# Then press:
# 'w' for web
# 'a' for Android
# 'i' for iOS
```

Enjoy testing your app! 🎉

