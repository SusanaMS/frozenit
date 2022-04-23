import { body } from "express-validator";

const validateLogin = [
  body("email")
    .exists()
    .withMessage("Se requiere: email")
    .isEmail()
    .withMessage("el email debe ser válido")
    .normalizeEmail(),
  body("password")
    .exists()
    .withMessage("se require: password")
    .notEmpty()
    .withMessage("la password no debe estra vacía"),
];

export { validateLogin };
