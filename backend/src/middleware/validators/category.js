import { body } from "express-validator";

const validateAddCategory = [
  body("name")
    .exists()
    .withMessage("Se requiere: name")
    .isAlpha()
    .withMessage("Solo caracteres alfabeticos")
    .isLength({ min: 2 })
    .withMessage("Longitud míníma 2"),
  body("expiration")
    .exists()
    .withMessage("Se require: expiration")
    .isInt({ min: 10, max: 365 })
    .withMessage("min: 10, max: 365"),
  body("remarks")
    .optional()
    .isAlphanumeric()
    .withMessage("Solo caracteres alfanúmericos"),
];

export { validateAddCategory };
