// src/services/users.service.js
const Users = require('../models/users.model');
const bcrypt = require('bcrypt');

const UsersService = {
  async findById(id) { return Users.findById(id); },

  async create(payload) {
    const hashed = await bcrypt.hash(payload.password, 10);
    return Users.create({ email: payload.email, password: hashed, full_name: payload.full_name, role: payload.role || 'cashier' });
  },

  async changePassword(userId, newPassword) {
    const hashed = await bcrypt.hash(newPassword, 10);
    return Users.updatePassword(userId, hashed);
  }
};

module.exports = UsersService;
