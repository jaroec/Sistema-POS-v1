// src/services/payments.service.js
const Payments = require('../models/payments.model');
const PaymentAccounts = require('../models/paymentAccounts.model');

module.exports = {
  async create(payload) {
    const created = await Payments.create(payload);
    if (created.payment_account_id) {
      await PaymentAccounts.updateBalance(created.payment_account_id, 'USD', created.amount_usd || 0);
    }
    return created;
  }
};
