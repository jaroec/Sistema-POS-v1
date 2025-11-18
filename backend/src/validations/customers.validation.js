const { body, param } = require("express-validator");

exports.createCustomerValidation = [
  body("name").notEmpty().withMessage("El nombre es obligatorio"),
  body("email").optional().isEmail().withMessage("Correo inválido"),
  body("phone").optional().isString(),
];

exports.updateCustomerValidation = [
  param("id").isUUID().withMessage("ID inválido"),
  body("name").optional().notEmpty(),
  body("email").optional().isEmail(),
  body("phone").optional().isString(),
];
