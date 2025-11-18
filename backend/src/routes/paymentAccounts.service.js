// src/services/paymentAccounts.service.js
const Payments = require('../models/paymentAccounts.model');

module.exports = {
  getAll: () => Payments.getAll(),
  findById: (id) => Payments.findById(id),
  create: (p) => Payments.create(p),
  updateBalance: (id, currency, delta) => Payments.updateBalance(id, currency, delta)
};
