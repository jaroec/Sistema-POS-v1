// src/validations/payments.validation.js
const { body, param } = require("express-validator");

exports.createPaymentValidation = [
  body("saleId")
    .isUUID()
    .withMessage("ID de venta inválido"),

  body("amount")
    .isFloat({ gt: 0 })
    .withMessage("Monto inválido"),

  body("method")
    .notEmpty()
    .withMessage("Método de pago obligatorio"),
];

exports.updatePaymentValidation = [
  param("id").isUUID(),
  body("amount").optional().isFloat({ gt: 0 }),
  body("method").optional().notEmpty(),
];
