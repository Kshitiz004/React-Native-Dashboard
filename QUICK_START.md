# Quick Start Guide

## Start Backend Server

```bash
# Terminal 1
cd server
npm run dev
```

Server runs on: http://localhost:4000

## Start Mobile App

```bash
# Terminal 2
cd mobile
npm start
```

Then:
- **Android**: Press `a` or run `npm run android`
- **iOS**: Press `i` or run `npm run ios`
- **Web**: Press `w` or run `npm run web`
- **Expo Go**: Scan QR code with Expo Go app

## Default Login Credentials

```
Email: admin@example.com
Password: admin123
```

## Features to Test

1. **Login** - Use admin credentials above
2. **Home** - View welcome and logout
3. **Users** (Admin only) - Create/edit users, assign roles
4. **Roles** (Admin only) - Create/edit roles (Admin/Employee)

## Create Test Employee User

After logging in as Admin:
1. Go to Users tab
2. Tap "+ Add"
3. Fill details, select "Employee" role
4. Save

Logout and login as Employee - only Home tab will be visible!

