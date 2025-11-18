// src/validations/auth.validation.js
const { body } = require("express-validator");

exports.loginValidation = [
  body("email")
    .isEmail()
    .withMessage("El correo electrónico no es válido"),

  body("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria"),
];
