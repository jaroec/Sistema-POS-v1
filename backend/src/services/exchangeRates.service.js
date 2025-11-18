// src/services/exchangeRates.service.js
const Exchange = require('../models/exchangeRates.model');

module.exports = {
  getLatest: () => Exchange.getLatest(),
  getByDate: (date) => Exchange.getByDate(date),
  create: (obj) => Exchange.create(obj)
};
