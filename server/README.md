# Server

Environment variables to set (copy .env.example to .env):

- PORT=4000
- MONGO_URI=mongodb://localhost:27017/healthcare_app
- JWT_SECRET=replace_me_with_a_long_random_string

Scripts:

- `npm run dev` – start with nodemon
- `npm start` – start server
- `node src/seed.js` – seed base roles and default admin

Endpoints:

- POST /api/auth/login { identifier: emailOrContact, password }
- GET/POST/PUT /api/users (Admin)
- GET/POST/PUT /api/roles (Admin)


