// src/validations/sales.validation.js
const { body, param } = require("express-validator");

exports.createSaleValidation = [
  body("customerId")
    .isUUID()
    .withMessage("ID de cliente inválido"),

  body("items")
    .isArray({ min: 1 })
    .withMessage("Debe incluir productos"),

  body("items.*.productId")
    .isUUID()
    .withMessage("ID de producto inválido"),

  body("items.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Cantidad inválida"),

  body("paymentMethod")
    .notEmpty()
    .withMessage("El método de pago es obligatorio"),
];

exports.updateSaleValidation = [
  param("id").isUUID(),
  body("paymentMethod").optional().notEmpty(),
];
  