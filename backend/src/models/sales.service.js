// src/services/sales.service.js
const Sales = require('../models/sales.model');
const Products = require('../models/products.model');
const PaymentsModel = require('../models/payments.model');
const PaymentAccounts = require('../models/paymentAccounts.model');

module.exports = {
  async create(payload) {
    const items = payload.items || [];
    let subtotal = 0;
    for (const it of items) {
      subtotal += (it.price * it.qty);
    }
    const discount = payload.discount || 0;
    const total = subtotal - discount;
    const exchange_rate = payload.exchange_rate || 1;
    const total_ves = total * exchange_rate;

    const saleRecord = {
      sale_code: payload.sale_code || `S-${Date.now()}`,
      customer_id: payload.customer_id || null,
      customer_name: payload.customer_name || null,
      items,
      subtotal,
      discount,
      total,
      total_ves,
      exchange_rate,
      paid_amount: payload.paid_amount || 0,
      paid_amount_ves: (payload.paid_amount || 0) * exchange_rate,
      balance: total - (payload.paid_amount || 0),
      balance_ves: (total_ves - ((payload.paid_amount || 0) * exchange_rate)),
      payment_method: payload.payment_method || null,
      payment_details: payload.payment_details || null,
      payment_account_id: payload.payment_account_id || null,
      payment_account_name: payload.payment_account_name || null,
      status: (payload.paid_amount >= total) ? 'Pagado' : 'Pendiente',
      sale_date: payload.sale_date || new Date(),
      notes: payload.notes || null,
      cashier: payload.cashier || null
    };

    const created = await Sales.create(saleRecord);

    // adjust stock
    for (const it of items) {
      await Products.adjustStock(it.product_id, -Math.abs(it.qty));
    }

    // register payment if any
    if (payload.paid_amount && payload.payment_account_id) {
      const payment = {
        sale_id: created.id,
        sale_code: created.sale_code,
        amount_usd: payload.paid_amount,
        amount_ves: payload.paid_amount * exchange_rate,
        exchange_rate,
        method: payload.payment_method || 'Unknown',
        payment_account_id: payload.payment_account_id,
        payment_account_name: payload.payment_account_name || null,
        reference: payload.reference || null
      };
      await PaymentsModel.create(payment);
      await PaymentAccounts.updateBalance(payment.payment_account_id, 'USD', payment.amount_usd);
    }

    return created;
  },

  findById: (id) => Sales.findById(id)
};
