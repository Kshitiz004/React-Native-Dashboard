// This is the serverless entry point for Vercel
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

// Adjust paths for Vercel serverless environment
const { authRouter } = require('../routes/auth');
const { usersRouter } = require('../routes/users');
const { rolesRouter } = require('../routes/roles');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/healthcare_app';

// Create a singleton connection
let mongoClient = null;

async function connectDB() {
  if (mongoClient) {
    return mongoClient;
  }
  try {
    mongoClient = await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    return mongoClient;
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    throw err;
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// API routes
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/roles', rolesRouter);

// Vercel serverless handler
module.exports = async (req, res) => {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

