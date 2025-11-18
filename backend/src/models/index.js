// ============================================
// INICIALIZACIÓN DE MODELOS Y RELACIONES
// ============================================

import sequelize from '../config/sequelize.js';
import User from './users.model.js';
import Customer from './customers.model.js';
import Product from './products.model.js';
import Sale from './sales.model.js';
import SaleItem from './saleItems.model.js';
import Payment from './payments.model.js';
import ExchangeRate from './exchangeRates.model.js';
import PaymentAccount from './paymentAccounts.model.js';
import InventoryMovement from './inventoryMovements.model.js';
import DailyCash from './dailyCash.model.js';

// ============================================
// RELACIONES
// ============================================

// Sale <-> Customer
Sale.belongsTo(Customer, { foreignKey: 'customer_id' });
Customer.hasMany(Sale, { foreignKey: 'customer_id' });

// Sale <-> User
Sale.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Sale, { foreignKey: 'user_id' });

// SaleItem <-> Sale
SaleItem.belongsTo(Sale, { foreignKey: 'sale_id' });
Sale.hasMany(SaleItem, { foreignKey: 'sale_id' });

// SaleItem <-> Product
SaleItem.belongsTo(Product, { foreignKey: 'product_id' });
Product.hasMany(SaleItem, { foreignKey: 'product_id' });

// Payment <-> Sale
Payment.belongsTo(Sale, { foreignKey: 'sale_id' });
Sale.hasMany(Payment, { foreignKey: 'sale_id' });

// Payment <-> PaymentAccount
Payment.belongsTo(PaymentAccount, { foreignKey: 'payment_account_id' });
PaymentAccount.hasMany(Payment, { foreignKey: 'payment_account_id' });

// InventoryMovement <-> Product
InventoryMovement.belongsTo(Product, { foreignKey: 'product_id' });
Product.hasMany(InventoryMovement, { foreignKey: 'product_id' });

// InventoryMovement <-> User
InventoryMovement.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(InventoryMovement, { foreignKey: 'user_id' });

// ============================================
// EXPORTAR
// ============================================

export {
  sequelize,
  User,
  Customer,
  Product,
  Sale,
  SaleItem,
  Payment,
  ExchangeRate,
  PaymentAccount,
  InventoryMovement,
  DailyCash
};
