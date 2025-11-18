const { body, param } = require("express-validator");

exports.createUserValidation = [
  body("name")
    .notEmpty()
    .withMessage("El nombre es obligatorio"),

  body("email")
    .isEmail()
    .withMessage("El correo es inválido"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),

  body("role")
    .isIn(["admin", "seller"])
    .withMessage("Rol inválido"),
];

exports.updateUserValidation = [
  param("id")
    .isUUID()
    .withMessage("ID inválido"),

  body("name")
    .optional()
    .notEmpty(),

  body("email")
    .optional()
    .isEmail(),

  body("role")
    .optional()
    .isIn(["admin", "seller"]),
];
