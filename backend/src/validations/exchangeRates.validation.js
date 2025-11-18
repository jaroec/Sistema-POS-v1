// src/validations/exchangeRates.validation.js
const { body, param } = require("express-validator");

exports.createExchangeRateValidation = [
  body("currency").notEmpty().withMessage("La moneda es obligatoria"),
  body("rate").isFloat({ gt: 0 }).withMessage("La tasa debe ser mayor a 0"),
];

exports.updateExchangeRateValidation = [
  param("id").isUUID(),
  body("currency").optional().notEmpty(),
  body("rate").optional().isFloat({ gt: 0 }),
];
