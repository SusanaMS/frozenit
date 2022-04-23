import { HttpException } from "../exceptions/HttpException.js";
import { UserModel } from "../models/user.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const auth = () => {
  return async function (req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      const bearer = "Bearer ";

      if (!authHeader || !authHeader.startsWith(bearer)) {
        throw new HttpException(401, "Accesso denegado");
      }

      const token = authHeader.replace(bearer, "");
      const secretKey = process.env.JWT_SECRET || "";

      const decoded = jwt.verify(token, secretKey);
      // una vez decodificado ell token nos devolvera el user_id y los parametros de duración
      // ej: {user_id: "anasus@gmail.com", iat: 1650722230, exp: 1650895030}

      // buscamos este id en la BD
      const user = await UserModel.findOne({ email: decoded.user_id });

      if (user.length !== 1) {
        throw new HttpException(401, "Authentication failed!");
      }

      req.currentUser = user[0];
      next();
    } catch (e) {
      e.status = 401;
      next(e);
    }
  };
};

export { auth };
