import * as queryHandler from "../db/connection.js";
import { colValueBinder } from "../db/utils.js";

class FoodModel {
  static tableName = "foods";

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

    // return back the first row (user)
    return result[0];
  };

  static insert = async ({ name, category, remarks = "" }) => {
    const sql = `INSERT INTO ${this.tableName}
        (name_food, categories_name_category, remarks) VALUES (?,?,?)`;

    const result = await queryHandler.default(sql, [name, category, remarks]);

    return result;
  };
}

export { FoodModel };
