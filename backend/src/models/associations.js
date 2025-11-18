import User from "./users.model.js";
import Customer from "./customers.model.js";
import Product from "./products.model.js";
import Sale from "./sales.model.js";
import SaleItem from "./saleItems.model.js";
import Payment from "./payments.model.js";
import PaymentAccount from "./paymentAccounts.model.js";

// SALE ↔ CUSTOMER
Sale.belongsTo(Customer, { foreignKey: "customer_id" });
Customer.hasMany(Sale, { foreignKey: "customer_id" });

// SALE ↔ USER
Sale.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(Sale, { foreignKey: "user_id" });

// SALE ↔ SALE ITEMS
Sale.hasMany(SaleItem, { foreignKey: "sale_id" });
SaleItem.belongsTo(Sale, { foreignKey: "sale_id" });

// SALE ITEM ↔ PRODUCT
SaleItem.belongsTo(Product, { foreignKey: "product_id" });
Product.hasMany(SaleItem, { foreignKey: "product_id" });

// SALE ↔ PAYMENTS
Sale.hasMany(Payment, { foreignKey: "sale_id" });
Payment.belongsTo(Sale, { foreignKey: "sale_id" });

// PAYMENT ↔ PAYMENT ACCOUNT
Payment.belongsTo(PaymentAccount, { foreignKey: "payment_account_id" });
PaymentAccount.hasMany(Payment, { foreignKey: "payment_account_id" });

export default function setupAssociations() {
  return {
    User,
    Customer,
    Product,
    Sale,
    SaleItem,
    Payment,
    PaymentAccount,
  };
}
