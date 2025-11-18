// src/services/auth.service.js
const Users = require('../models/users.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: __dirname + '/../../.env' });

const authService = {
  async login(email, password) {
    const user = await Users.findByEmail(email);
    if (!user) {
      const e = new Error('Invalid credentials');
      e.status = 401;
      throw e;
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      const e = new Error('Invalid credentials');
      e.status = 401;
      throw e;
    }
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '8h' });
    return { token, user: { id: user.id, email: user.email, full_name: user.full_name, role: user.role } };
  }
};

module.exports = authService;
