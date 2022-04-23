import { validationResult } from "express-validator";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

import { UserModel } from "../models/user.js";

class UserController {
  static getAllUsers = async (req, res, next) => {
    // esperamos a que se resuelva la Query con un awit
    let userList = await UserModel.find();
    // en caso de que el array devuelto no tenga contenido arrojamos una excepction
    if (!userList.length) {
      res.status(400).send({
        message: "No se han encontrado usuarios",
      });
    }
    // devolvemos la lista sin los metadatatos
    res.send(userList[0]);
  };

  static getUserByEmail = async (req, res, next) => {
    const user = await UserModel.findOne({ email: req.params.email });
    if (user.length !== 1) {
      res.status(400).send({
        message: "Usuario no encontrado",
      });
    }
    // eliminamos las pass del response
    const { pass, ...userWithoutPassword } = user[0];

    res.send(userWithoutPassword);
  };

  static signUp = async (req, res, next) => {
    const isReqValid = this.checkValidation(req);

    if (isReqValid != null) {
      res.status(404).json({ error: isReqValid });
      return;
    }
    //TODO: hash de password
    console.log("req.body:", req.body);

    const result = await UserModel.insert(req.body);
    console.log("signup result", result);

    if (!result[0].affectedRows) {
      res.status(404).json({ error: "error en signup" });
      console.error("error en signup");
      return;
    }

    res.status(201).json({ mensaje: "SignUp Correcto!" });
  };

  static login = async (req, res, next) => {
    console.log("login:", req.body.email);
    const isReqValid = this.checkValidation(req, res);

    if (isReqValid != null) {
      res.status(404).json({ error: isReqValid });
      return;
    }

    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    console.log(user);
    if (user.length !== 1) {
      res.status(404).json({ error: "usuario no encontrado" });
      console.error(`usuario ${email} no encontrdao`);
      return;
    }

    const { pass, ...userNoPass } = user[0];

    // TODO: chechear de forma segura mediante hash
    if (password !== pass) {
      res.status(404).json({ error: "usuario o password erronea" });
      console.error(`usuario o password ${email} erronea`);
      return;
    }

    // una vez confirmado el login generamos el token JWT
    // https://www.npmjs.com/package/jsonwebtoken
    const secret = process.env.JWT_SECRET || "";
    const token = jwt.sign({ user_id: userNoPass.email.toString() }, secret, {
      expiresIn: process.env.JWT_EXPIRES || "24h",
    });

    res.send({ ...userNoPass, token });
  };

  static checkValidation = (req, res) => {
    const result = validationResult(req).formatWith(errorFormatter);
    if (!result.isEmpty()) {
      console.error({ errors: result.array() });
      return result.array().toString();
    }
  };
}

const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
  return `${location}[${param}]: ${msg}`;
};

export { UserController };
