// src/services/customers.service.js
const Customers = require('../models/customers.model');

module.exports = {
  getAll: () => Customers.getAll(),
  findById: (id) => Customers.findById(id),
  create: (c) => Customers.create(c),
  update: (id, fields) => Customers.update(id, fields)
};
