import { body } from "express-validator";

const validateAddRecord = [
  body("email")
    .exists()
    .withMessage("Se requiere: email")
    .isEmail()
    .withMessage("el email debe ser válido")
    .normalizeEmail(),
  body("freezerId")
    .exists()
    .withMessage("Se requiere: freezerId")
    .isNumeric()
    .withMessage("Solo caracteres numericos"),
  body("foodId")
    .exists()
    .withMessage("Se requiere: foodId")
    .isNumeric()
    .withMessage("Solo caracteres numericos"),
  body("addDate").exists().isDate({ format: "YYYY-MM-DD" }),
];

export { validateAddRecord };
