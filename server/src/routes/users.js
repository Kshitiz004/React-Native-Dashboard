const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { User } = require('../models/User');
const { authRequired, requireRole } = require('../middleware/auth');

const usersRouter = express.Router();

// Create user (Admin only)
usersRouter.post(
  '/',
  authRequired,
  requireRole('Admin'),
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('roles').isArray().optional(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const { name, email, contact, password, roles = ['Employee'] } = req.body;
      const existing = await User.findOne({ email });
      if (existing) return res.status(409).json({ message: 'Email already exists' });
      const passwordHash = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, contact, passwordHash, roles });
      return res.status(201).json({ id: user._id });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

// List users (Admin only)
usersRouter.get('/', authRequired, requireRole('Admin'), async (req, res) => {
  const users = await User.find().select('-passwordHash').lean();
  res.json(users);
});

// Update user (Admin only)
usersRouter.put(
  '/:id',
  authRequired,
  requireRole('Admin'),
  body('email').optional().isEmail(),
  body('password').optional().isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const { id } = req.params;
      const { name, email, contact, password, roles } = req.body;
      const update = { name, email, contact };
      if (password) update.passwordHash = await bcrypt.hash(password, 10);
      if (roles) update.roles = roles;
      const user = await User.findByIdAndUpdate(id, update, { new: true }).select('-passwordHash');
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = { usersRouter };


