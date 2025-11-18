// ============================================
// ENRUTADOR PRINCIPAL
// ============================================

import { Router } from 'express';
import authRoutes from './auth.routes.js';
import usersController from '../controllers/users.controller.js';
import productsController from '../controllers/products.controller.js';
import customersController from '../controllers/customers.controller.js';
import salesController from '../controllers/sales.controller.js';
import paymentsController from '../controllers/payments.controller.js';
import exchangeRatesController from '../controllers/exchangeRates.controller.js';
import paymentAccountsController from '../controllers/paymentAccounts.controller.js';
import inventoryController from '../controllers/inventory.controller.js';
import dashboardController from '../controllers/dashboard.controller.js';
import reportController from '../controllers/report.controller.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = Router();

// ============================================
// RUTAS PÚBLICAS
// ============================================
router.use('/auth', authRoutes);

// ============================================
// RUTAS PROTEGIDAS
// ============================================

// USUARIOS (Solo admin)
router.get('/users', authenticate, isAdmin, usersController.getAll);
router.post('/users', authenticate, isAdmin, usersController.create);
router.put('/users/:id', authenticate, isAdmin, usersController.update);
router.delete('/users/:id', authenticate, isAdmin, usersController.delete);
router.put('/users/:id/toggle', authenticate, isAdmin, usersController.toggleActive);
router.post('/users/change-password', authenticate, usersController.changePassword);

// PRODUCTOS
router.get('/products', authenticate, productsController.getProducts);
router.get('/products/:id', authenticate, productsController.getProductById);
router.post('/products', authenticate, isAdmin, productsController.createProduct);
router.put('/products/:id', authenticate, isAdmin, productsController.updateProduct);
router.delete('/products/:id', authenticate, isAdmin, productsController.deleteProduct);
router.get('/products/stats/top-selling', authenticate, productsController.getTopSellingProducts);
router.get('/products/stats/low-stock', authenticate, productsController.getLowStockProducts);

// CLIENTES
router.get('/customers', authenticate, customersController.getCustomers);
router.get('/customers/:id', authenticate, customersController.getCustomerById);
router.post('/customers', authenticate, customersController.createCustomer);
router.put('/customers/:id', authenticate, customersController.updateCustomer);
router.delete('/customers/:id', authenticate, isAdmin, customersController.deleteCustomer);
router.get('/customers/:id/sales', authenticate, customersController.getCustomerSales);
router.get('/customers/:id/payments', authenticate, customersController.getCustomerPayments);

// VENTAS
router.get('/sales', authenticate, salesController.getSales);
router.get('/sales/:id', authenticate, salesController.getSaleById);
router.post('/sales', authenticate, salesController.createSale);
router.post('/sales/:id/cancel', authenticate, isAdmin, salesController.cancelSale);
router.get('/sales/reports/daily', authenticate, salesController.getDailySales);
router.get('/sales/reports/monthly', authenticate, salesController.getMonthlySales);
router.get('/sales/reports/totals', authenticate, salesController.getTotals);
router.get('/sales/reports/top-products', authenticate, salesController.getTopProducts);
router.get('/sales/reports/top-customers', authenticate, salesController.getTopCustomers);

// PAGOS
router.get('/payments/sale/:sale_id', authenticate, paymentsController.getBySale);
router.post('/payments/add', authenticate, paymentsController.addPayment);
router.get('/payments/customer/:customer_id', authenticate, paymentsController.getCustomerPayments);
router.get('/payments', authenticate, paymentsController.listPayments);

// TASAS DE CAMBIO
router.get('/exchange-rates', authenticate, exchangeRatesController.getAll);
router.get('/exchange-rates/active', authenticate, exchangeRatesController.getActive);
router.post('/exchange-rates', authenticate, isAdmin, exchangeRatesController.createRate);
router.put('/exchange-rates/:id/activate', authenticate, isAdmin, exchangeRatesController.activateRate);
router.delete('/exchange-rates/:id', authenticate, isAdmin, exchangeRatesController.deleteRate);

// CUENTAS DE PAGO
router.get('/payment-accounts', authenticate, paymentAccountsController.getAll);
router.get('/payment-accounts/enabled', authenticate, paymentAccountsController.getEnabled);
router.post('/payment-accounts', authenticate, isAdmin, paymentAccountsController.create);
router.put('/payment-accounts/:id', authenticate, isAdmin, paymentAccountsController.update);
router.put('/payment-accounts/:id/enable', authenticate, isAdmin, paymentAccountsController.enable);
router.delete('/payment-accounts/:id', authenticate, isAdmin, paymentAccountsController.delete);

// INVENTARIO
router.get('/inventory/movements', authenticate, inventoryController.getAllMovements);
router.get('/inventory/product/:id', authenticate, inventoryController.getKardex);
router.post('/inventory/entrada', authenticate, inventoryController.addEntrada);
router.post('/inventory/salida', authenticate, inventoryController.addSalida);
router.post('/inventory/ajuste', authenticate, isAdmin, inventoryController.addAjuste);

// DASHBOARD
router.get('/dashboard/day', authenticate, dashboardController.getDayStats);
router.get('/dashboard/month', authenticate, dashboardController.getMonthStats);
router.get('/dashboard/low-stock', authenticate, dashboardController.getLowStock);
router.get('/dashboard/top-products', authenticate, dashboardController.getTopProducts);
router.get('/dashboard/weekly-sales', authenticate, dashboardController.getWeeklySales);
router.get('/dashboard/payment-methods', authenticate, dashboardController.getPaymentMethods);
router.get('/dashboard/recent-sales', authenticate, dashboardController.getRecentSales);

// REPORTES
router.get('/reports/sales-by-range', authenticate, reportController.salesByRange);
router.get('/reports/top-products', authenticate, reportController.topProducts);
router.get('/reports/customer-stats', authenticate, reportController.customerStats);
router.get('/reports/cash-summary', authenticate, reportController.cashSummary);
router.get('/reports/dashboard', authenticate, reportController.dashboardReport);
router.get('/reports/export-sales-csv', authenticate, reportController.exportSalesCSV);

export default router;
