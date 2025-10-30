# Vercel Deployment Guide

This guide will help you deploy the React Native Dashboard server to Vercel.

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. A MongoDB database (MongoDB Atlas recommended)
3. Vercel CLI installed (optional, for command line deployment)

## Step 1: Set up MongoDB

1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster (free tier is sufficient for development)
3. Create a database user with read/write permissions
4. Whitelist all IPs (0.0.0.0/0) for development, or add Vercel's IPs for production
5. Get your connection string (format: `mongodb+srv://username:password@cluster.mongodb.net/database_name`)

## Step 2: Configure Environment Variables

You need to set these environment variables in Vercel:

### Required Environment Variables:

- `MONGO_URI` - Your MongoDB connection string
  - Example: `mongodb+srv://user:password@cluster.mongodb.net/healthcare_app`
  
- `JWT_SECRET` - A long random string for signing JWT tokens
  - Generate one using: `openssl rand -base64 32`
  - Or use an online generator

- `PORT` - Server port (optional, defaults to 4000)
  - Example: `4000`

## Step 3: Deploy to Vercel

### Option A: Using Vercel Web UI

1. Go to https://vercel.com and sign in
2. Click "Add New Project"
3. Import your GitHub repository (https://github.com/Kshitiz004/React-Native-Dashboard)
4. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: Leave as default (entire project)
   - **Build Command**: Leave empty
   - **Output Directory**: Leave empty
5. Add environment variables:
   - Click "Environment Variables"
   - Add each variable (MONGO_URI, JWT_SECRET, PORT)
   - Ensure they're set for Production, Preview, and Development
6. Click "Deploy"

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
cd /path/to/React-Native-Dashboard-master
vercel

# Set environment variables
vercel env add MONGO_URI
vercel env add JWT_SECRET
vercel env add PORT

# Deploy to production
vercel --prod
```

## Step 4: Update API Configuration

After deployment, Vercel will provide you with a URL (e.g., `https://your-project.vercel.app`).

Update your mobile app's API configuration:

**File: `config/api.js`**

```javascript
// For production, update the base URL
const API_BASE_URL = 'https://your-project.vercel.app/api';

// Or use environment-based configuration:
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:4000'  // Development
  : 'https://your-project.vercel.app/api';  // Production
```

## Step 5: Seed Initial Data (Optional)

After deployment, you may want to seed your database with initial roles and admin user.

You can create a simple API endpoint or use a one-time script. Create a seed endpoint:

**File: `server/src/routes/seed.js`** (for one-time use)

```javascript
const express = require('express');
const { User } = require('../models/User');
const { Role } = require('../models/Role');
const bcrypt = require('bcryptjs');

const seedRouter = express.Router();

// One-time seed endpoint (REMOVE IN PRODUCTION)
seedRouter.post('/seed', async (req, res) => {
  try {
    // Create roles
    await Role.create([
      { name: 'Admin', description: 'Administrator with full access' },
      { name: 'Employee', description: 'Regular employee' }
    ]);

    // Create default admin
    const passwordHash = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      contact: '1234567890',
      passwordHash,
      roles: ['Admin']
    });

    res.json({ message: 'Database seeded successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = { seedRouter };
```

Then call `POST https://your-project.vercel.app/api/seed` once, then remove this endpoint.

## Step 6: Test Your Deployment

Test your API endpoints:

```bash
# Health check
curl https://your-project.vercel.app/api/health

# Login
curl -X POST https://your-project.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"admin@example.com","password":"admin123"}'
```

## Troubleshooting

### Common Issues:

1. **MongoDB Connection Error**
   - Ensure your MongoDB IP whitelist includes all IPs or Vercel's IP ranges
   - Check your connection string is correct
   - Verify database credentials

2. **Environment Variables Not Loading**
   - Make sure variables are set for all environments (Production, Preview, Development)
   - Redeploy after adding environment variables

3. **CORS Errors**
   - The server is configured to accept all origins
   - If issues persist, update the CORS configuration in `server/src/api/index.js`

4. **Serverless Timeout**
   - Vercel free tier has execution limits
   - For production, consider upgrading or optimizing database queries

## Security Notes

- Never commit `.env` files or `JWT_SECRET` to Git
- Use strong, randomly generated JWT secrets in production
- Consider rate limiting for production use
- Add request validation middleware
- Use HTTPS only for all API calls
- Regularly update dependencies

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Serverless Node.js Guide](https://vercel.com/docs/runtimes#official-runtimes/node-js)

## Post-Deployment

After successful deployment:

1. Test all endpoints
2. Update your mobile app's API configuration
3. Update documentation with the new API URL
4. Set up monitoring and alerts
5. Configure custom domain (optional)

