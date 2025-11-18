// src/validations/paymentAccounts.validation.js
const { body, param } = require("express-validator");

exports.createPaymentAccountValidation = [
  body("bank").notEmpty().withMessage("El banco es obligatorio"),
  body("accountNumber")
    .notEmpty()
    .withMessage("El número de cuenta es obligatorio"),
  body("type")
    .isIn(["corriente", "ahorro", "movil"])
    .withMessage("Tipo de cuenta inválido"),
];

exports.updatePaymentAccountValidation = [
  param("id").isUUID(),
  body("bank").optional().notEmpty(),
  body("accountNumber").optional().notEmpty(),
  body("type").optional().isIn(["corriente", "ahorro", "movil"]),
];
