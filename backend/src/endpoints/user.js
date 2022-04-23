import { Router as EndPointRouter } from "express";
import { body } from "express-validator";
import { UserController } from "../controllers/user.js";
import { auth } from "../middleware/auth.js";
// https://expressjs.com/es/api.html#express.router
const userEndPoint = EndPointRouter({ caseSensitive: true });

// http://localhost:3000/api/v1/users/all/
userEndPoint.get("/all/", auth(), UserController.getAllUsers);
// http://localhost:3000/api/v1/users/email/anasus@gmail.com
userEndPoint.get("/email/:email", UserController.getUserByEmail);

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

userEndPoint.post("/login", validateLogin, UserController.login);

export { userEndPoint };
