# Healthcare Management System

Full-stack healthcare management app with React Native (Expo) and Node.js/Express backend.

## Project Structure

```
Healthcare/
├── server/          # Backend (Node.js/Express/MongoDB)
├── mobile/          # Frontend (React Native/Expo)
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v20+)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

```bash
cd server
npm install
npm run seed    # Creates default admin user
npm run dev     # Start server (port 4000)
```

Default Admin Credentials:
- Email: `admin@example.com`
- Password: `admin123`

### Frontend Setup

```bash
cd mobile
npm install
npm start       # Start Expo development server
```

Then scan QR code with Expo Go app or run:
- `npm run android` - Android emulator
- `npm run ios` - iOS simulator
- `npm run web` - Web browser

## Features

### Login Page
- Email or contact-based authentication
- Secure JWT tokens

### Home Page
- Welcome message
- User profile display
- Logout functionality

### Users Management (Admin Only)
- Create/Edit users
- Assign roles (Admin/Employee)
- View all users

### Roles Management (Admin Only)
- Create/Edit roles
- Admin: All pages accessible
- Employee: Only Home page visible

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email/contact + password

### Users (Admin Only)
- `GET /api/users` - List all users
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user

### Roles (Admin Only)
- `GET /api/roles` - List all roles
- `POST /api/roles` - Create role
- `PUT /api/roles/:id` - Update role

## Environment Variables

Create a `.env` file in the `server` directory:

```
PORT=4000
MONGO_URI=mongodb://localhost:27017/healthcare_app
JWT_SECRET=your_secret_key_here
```

## Technology Stack

**Backend:**
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- bcryptjs (password hashing)

**Frontend:**
- React Native
- Expo
- React Navigation
- AsyncStorage
- Axios

## License

ISC

