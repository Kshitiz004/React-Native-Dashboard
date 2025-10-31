const express = require('express');
const { body, validationResult } = require('express-validator');
const { Role } = require('../models/Role');
const { authRequired, requireRole } = require('../middleware/auth');

const rolesRouter = express.Router();

// Create role (Admin)
rolesRouter.post(
  '/',
  authRequired,
  requireRole('Admin'),
  body('name').isIn(['Admin', 'Employee']).withMessage('Role must be Admin or Employee'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const { name, description } = req.body;
      const existing = await Role.findOne({ name });
      if (existing) return res.status(409).json({ message: 'Role already exists' });
      const role = await Role.create({ name, description });
      res.status(201).json(role);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// List roles (Admin)
rolesRouter.get('/', authRequired, requireRole('Admin'), async (req, res) => {
  const roles = await Role.find().lean();
  res.json(roles);
});

// Update role (Admin)
rolesRouter.put(
  '/:id',
  authRequired,
  requireRole('Admin'),
  body('name').optional().isIn(['Admin', 'Employee']),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      const role = await Role.findByIdAndUpdate(id, { name, description }, { new: true });
      if (!role) return res.status(404).json({ message: 'Role not found' });
      res.json(role);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = { rolesRouter };


