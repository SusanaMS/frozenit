import { validationResult } from "express-validator";

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

  static login = async (req, res, next) => {
    console.log("REQQQQ:", req.body.email);
    this.checkValidation(req);

    const { email, password } = req.body;

    console.log(email, password);

    const user = await UserModel.findOne({ email });

    if (user.length !== 1) {
      res.status(404).json({ error: "usuario no encontrado" });
      console.error(`usuario ${email} no encontrdao`);
      return;
    }

    res.send(user);
  };

  static checkValidation = (req) => {
    const result = validationResult(req).formatWith(errorFormatter);
    if (!result.isEmpty()) {
      console.error({ errors: result.array() });
    }
  };
}

const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
  return `${location}[${param}]: ${msg}`;
};

export { UserController };
