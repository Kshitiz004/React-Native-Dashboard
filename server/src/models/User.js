const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contact: { type: String },
    passwordHash: { type: String, required: true },
    roles: [{ type: String, enum: ['Admin', 'Employee'], default: 'Employee' }],
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
module.exports = { User };


