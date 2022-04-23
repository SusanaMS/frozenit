import { Router as EndPointRouter } from "express";
import { UserController } from "../controllers/user.js";
import { auth } from "../middleware/auth.js";
import { validateLogin } from "../middleware/validators.js";
// https://expressjs.com/es/api.html#express.router
const userEndPoint = EndPointRouter({ caseSensitive: true });

// http://localhost:3000/api/v1/users/all/
userEndPoint.get("/all/", auth(), UserController.getAllUsers);
// http://localhost:3000/api/v1/users/email/anasus@gmail.com
userEndPoint.get("/email/:email", UserController.getUserByEmail);

userEndPoint.post("/login", validateLogin, UserController.login);

export { userEndPoint };
