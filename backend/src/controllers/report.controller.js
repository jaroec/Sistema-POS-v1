import reportService from "../services/report.service.js";

export default {
  async salesByRange(req, res) {
    try {
      const { start, end } = req.query;
      const data = await reportService.salesByRange(start, end);
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: "Error generando ventas por rango", err });
    }
  },

  async topProducts(req, res) {
    try {
      const { start, end, limit } = req.query;
      const data = await reportService.topProducts(start, end, limit || 10);
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: "Error generando top productos", err });
    }
  },

  async customerStats(req, res) {
    try {
      const { start, end } = req.query;
      const data = await reportService.customerStats(start, end);
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: "Error generando stats clientes", err });
    }
  },

  async cashSummary(req, res) {
    try {
      const { date } = req.query;
      const data = await reportService.cashSummary(date);
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: "Error generando resumen de caja", err });
    }
  },

  async dashboardReport(req, res) {
    try {
      const { start, end } = req.query;
      const data = await reportService.dashboardReport(start, end);
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: "Error generando dashboard report", err });
    }
  },

  async exportSalesCSV(req, res) {
    try {
      const { start, end } = req.query;
      const rows = await reportService.exportSalesCSV(start, end);

      // construir CSV simple
      const headers = ["sale_code","date","customer","total_usd","total_ves","status"];
      const csv = [
        headers.join(","),
        ...rows.map(r => [r.sale_code, r.createdAt, r.Customer?.name || "", r.total_usd, r.total_ves, r.status].map(v => `"${String(v).replace(/"/g,'""')}"`).join(","))
      ].join("\n");

      res.setHeader("Content-disposition", `attachment; filename=sales_${start || 'start'}_${end || 'end'}.csv`);
      res.set("Content-Type", "text/csv");
      res.status(200).send(csv);
    } catch (err) {
      res.status(500).json({ message: "Error exportando CSV", err });
    }
  }
};
