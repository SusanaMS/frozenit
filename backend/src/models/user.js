import * as queryHandler from "../db/connection.js";
import { colValueBinder } from "../db/utils.js";

class UserModel {
  static tableName = "frozenit.users";

  static find = async (params = {}) => {
    let sql = `SELECT * FROM ${this.tableName}`;

    console.log(sql);
    return queryHandler.default(sql, null);
  };

  static findOne = async (params) => {
    // https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
    // permite desempacar valores de arreglos o propiedades de objetos en distintas variables.
    const { colString, values } = colValueBinder(params);

    if (colString == null) {
      // TODO: salida erronea, trasmitir mensaje
      return [];
    }

    const sql = `SELECT * FROM ${this.tableName} WHERE ${colString}`;

    // pasamos el SQL con el BIND a los valores
    const result = await queryHandler.default(sql, [...values]);

    // devolvemos el usuario
    return result[0];
  };

  static insert = async ({
    email,
    password,
    username,
    surname,
    phone,
    isAdmin = 0,
  }) => {
    const sql = `INSERT INTO ${this.tableName}
        (email, pass, username, surname,  phone, is_admin) VALUES (?,?,?,?,?,?)`;

    const result = await queryHandler.default(sql, [
      email,
      password,
      username,
      surname,
      phone,
      isAdmin,
    ]);

    return result;
  };
}

export { UserModel };
