import dashboardService from "../services/dashboard.service.js";

export default {
  async getDayStats(req, res) {
    try {
      const data = await dashboardService.getDayStats();
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: "Error obteniendo estadísticas del día", err });
    }
  },

  async getMonthStats(req, res) {
    try {
      const data = await dashboardService.getMonthStats();
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: "Error obteniendo estadísticas del mes", err });
    }
  },

  async getLowStock(req, res) {
    try {
      const data = await dashboardService.getLowStock();
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: "Error obteniendo productos de bajo stock", err });
    }
  },

  async getTopProducts(req, res) {
    try {
      const data = await dashboardService.getTopProducts();
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: "Error obteniendo top productos", err });
    }
  },

  async getWeeklySales(req, res) {
    try {
      const data = await dashboardService.getWeeklySales();
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: "Error obteniendo ventas semanales", err });
    }
  },

  async getPaymentMethods(req, res) {
    try {
      const data = await dashboardService.getPaymentMethodStats();
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: "Error obteniendo métodos de pago", err });
    }
  },

  async getRecentSales(req, res) {
    try {
      const data = await dashboardService.getRecentSales();
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: "Error obteniendo últimas ventas", err });
    }
  },
};
