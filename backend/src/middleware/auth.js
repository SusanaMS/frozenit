import { HttpException } from "../exceptions/HttpException.js";
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
      console.log(token);
      const secretKey = process.env.JWT_SECRET || "";

      const decoded = jwt.verify(token, secretKey);
      // una vez decodificado ell token nos devolvera el user_id y los parametros de duración
      // ej: {user_id: "anasus@gmail.com", iat: 1650722230, exp: 1650895030}

      next();
    } catch (e) {
      e.status = 401;
      next(e);
    }
  };
};

export { auth };
