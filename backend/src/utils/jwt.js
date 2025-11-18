// src/utils/jwt.js
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: __dirname + '/../../.env' });

function sign(payload, expiresIn = '8h') {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}

function verify(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = { sign, verify };
