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
    .isLength({ min: 4 })
    .withMessage("Longitud míníma 4")
    .withMessage("Longitud míníma 4"),
];

const validateSignUp = [
  body("email")
    .exists()
    .withMessage("Se requiere: email")
    .isEmail()
    .withMessage("el email debe ser válido")
    .normalizeEmail(),
  body("password")
    .exists()
    .withMessage("Se require: password")
    .notEmpty()
    .isLength({ min: 4 })
    .withMessage("Longitud míníma 4")
    .isLength({ max: 20 })
    .withMessage("Longitud maxíma 20"),
  body("validation_password")
    .exists()
    .custom((value, { req }) => value === req.body.password)
    .withMessage("validation_password debe ser igual que el campo password"),
  body("username")
    .exists()
    .withMessage("Se requiere: username")
    .isAlpha()
    .withMessage("Solo caracteres alfabeticos")
    .isLength({ min: 2 })
    .withMessage("Longitud míníma 2"),
  body("surname")
    .optional()
    .isAlpha()
    .withMessage("Solo caracteres alfabeticos")
    .isLength({ min: 2 })
    .withMessage("Longitud míníma 2"),
  body("phone")
    .optional()
    .isAlphanumeric()
    .withMessage("Solo caracteres alfanúmericos")
    .isLength({ min: 8 })
    .withMessage("Longitud míníma 8"),
  body("avatar").optional(),
];

export { validateLogin, validateSignUp };
