// src/services/products.service.js
const Products = require('../models/products.model');

module.exports = {
  getAll: () => Products.getAll(),
  findById: (id) => Products.findById(id),
  create: (p) => Products.create(p),
  update: (id, fields) => Products.update(id, fields),
  adjustStock: (id, delta) => Products.adjustStock(id, delta)
};
