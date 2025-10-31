const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const { Role } = require('./models/Role');
const { User } = require('./models/User');

async function run() {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/healthcare_app';
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');
  // Ensure base roles exist
  for (const name of ['Admin', 'Employee']) {
    const exists = await Role.findOne({ name });
    if (!exists) await Role.create({ name });
  }
  // Create default admin if none
  const adminExists = await User.findOne({ roles: { $in: ['Admin'] } });
  if (!adminExists) {
    const passwordHash = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      contact: '9999999999',
      passwordHash,
      roles: ['Admin'],
    });
    console.log('Created default admin: admin@example.com / admin123');
  } else {
    console.log('Admin already exists; skipping');
  }
  await mongoose.disconnect();
}

run().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });


