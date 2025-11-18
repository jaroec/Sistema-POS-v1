const { body, param } = require("express-validator");

exports.createProductValidation = [
  body("name").notEmpty().withMessage("El nombre es obligatorio"),
  body("price").isFloat({ gt: 0 }).withMessage("Precio inválido"),
  body("stock").isInt({ min: 0 }).withMessage("Stock inválido"),
];

exports.updateProductValidation = [
  param("id").isUUID().withMessage("ID inválido"),
  body("name").optional().notEmpty(),
  body("price").optional().isFloat({ gt: 0 }),
  body("stock").optional().isInt({ min: 0 }),
];
