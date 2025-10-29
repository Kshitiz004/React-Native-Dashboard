const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/User');

const authRouter = express.Router();

authRouter.post(
  '/login',
  body('identifier').notEmpty().withMessage('Email or contact required'),
  body('password').isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { identifier, password } = req.body;
    try {
      const query = identifier.includes('@') ? { email: identifier } : { contact: identifier };
      const user = await User.findOne(query).lean();
      if (!user) return res.status(401).json({ message: 'Invalid credentials' });
      const ok = await bcrypt.compare(password, user.passwordHash);
      if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
      const token = jwt.sign(
        { userId: user._id.toString(), roles: user.roles, name: user.name },
        process.env.JWT_SECRET || 'dev_secret',
        { expiresIn: '12h' }
      );
      return res.json({
        token,
        user: { id: user._id, name: user.name, email: user.email, contact: user.contact, roles: user.roles },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = { authRouter };


