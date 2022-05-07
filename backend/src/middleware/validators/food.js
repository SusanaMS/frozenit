import { body } from "express-validator";

const validateAddFood = [
  body("name")
    .exists()
    .withMessage("Se requiere: name")
    .isLength({ min: 2 })
    .withMessage("Longitud míníma 2"),
  body("category")
    .exists()
    .withMessage("Se require: category")
    .isAlpha()
    .withMessage("Solo caracteres alfabeticos")
    .isLength({ min: 2 })
    .withMessage("Longitud míníma 2"),
  body("remarks").optional(),
];

export { validateAddFood };
