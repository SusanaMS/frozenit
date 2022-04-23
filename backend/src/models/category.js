import * as queryHandler from "../db/connection.js";
import { colValueBinder } from "../db/utils.js";

class CategoryModel {
  static tableName = "categories";

  static find = async (params = {}) => {
    let sql = `SELECT * FROM ${this.tableName}`;

    console.log(sql);
    return queryHandler.default(sql, null);
  };

  static findOne = async (params) => {
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

  static insert = async ({ name, expiration, remarks = "" }) => {
    const sql = `INSERT INTO ${this.tableName}
        (name_category, expiration_days, remarks) VALUES (?,?,?)`;

    return await queryHandler.default(sql, [name, expiration, remarks]);
  };

  static delete = async (name) => {
    return await queryHandler.default(
      `DELETE FROM ${this.tableName} WHERE name_category = ?`,
      [name]
    );
  };
}

export { CategoryModel };
