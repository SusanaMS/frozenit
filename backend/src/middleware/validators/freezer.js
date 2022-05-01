import { body } from "express-validator";

const validateAddFreezer = [
  body("email")
    .exists()
    .withMessage("Se requiere: email")
    .isEmail()
    .withMessage("el email debe ser válido")
    .normalizeEmail(),
  body("name")
    .exists()
    .withMessage("Se requiere: name")
    .isString()
    .withMessage("Solo caracteres alfabeticos")
    .isLength({ min: 2 })
    .withMessage("Longitud míníma 2"),
  body("brand")
    .optional()
    .isAlpha()
    .withMessage("Solo caracteres alfabeticos")
    .isLength({ min: 2 })
    .withMessage("Longitud míníma 2"),
  body("mdel")
    .optional()
    .isAlphanumeric()
    .withMessage("Solo caracteres alfanúmericos")
    .isLength({ min: 6 })
    .withMessage("Longitud míníma 6"),
  body("stars")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("min: 1, max: 5"),
  body("stars")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("min: 1, max: 5"),
  body("notes").optional().isString(),
];

export { validateAddFreezer };
