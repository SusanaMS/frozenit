import { Router as EndPointRouter } from "express";
import { UserController } from "../controllers/user.js";
import { auth } from "../middleware/auth.js";
import {
  validateLogin,
  validateSignUp,
} from "../middleware/validators/user.js";
// https://expressjs.com/es/api.html#express.router
const userEndPoint = EndPointRouter({ caseSensitive: true });

// http://localhost:3000/api/v1/users/all/
userEndPoint.get("/all/", auth(), UserController.getAllUsers);
// http://localhost:3000/api/v1/users/email/anasus@gmail.com
userEndPoint.get("/email/:email", auth(), UserController.getUserByEmail);

userEndPoint.post("/login", validateLogin, UserController.login);

userEndPoint.post("/signup", validateSignUp, UserController.signUp);

export { userEndPoint };
