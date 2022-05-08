import { UserModel } from "../models/user.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const auth = () => {
  return async function (req, res, next) {
    try {
      const jwtHeaderAuth = req.headers.authorization;
      const bearer = "Bearer ";

      if (!jwtHeaderAuth || !jwtHeaderAuth.startsWith(bearer)) {
        console.error(`auth ${jwtHeaderAuth}`);
        res.status(404).json({ error: "Error de autenticación!" });
        return;
      }

      const decodedToken = jwt.verify(
        jwtHeaderAuth.replace(bearer, ""),
        process.env.JWT_SECRET || ""
      );

      // una vez decodificado ell token nos devolvera el user_id y los parametros de duración
      // ej: {user_id: "anasus@gmail.com", iat: 1650722230, exp: 1650895030}

      // buscamos este id en la BD
      const user = await UserModel.findOne({ email: decodedToken.user_id });

      // si no lo encontramos el usuario probablemente ha sido eliminado pero el token
      // permanicía en el cliente
      if (user === null || user.length !== 1) {
        res.status(404).json({ error: "usuario no encontrado" });
        return;
      }

      req.currentUser = user[0];
      next();
    } catch (e) {
      let errorMessage;
      if (e.name == "TokenExpiredError") {
        errorMessage = "la sesión ha caducado";
      } else {
        errorMessage = e.message;
      }
      console.error(errorMessage);
      res.status(404).json({ error: errorMessage });
      next(e);
    }
  };
};

export { auth };
