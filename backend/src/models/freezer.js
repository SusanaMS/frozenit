import * as queryHandler from "../db/connection.js";
import { colValueBinder } from "../db/utils.js";

class FreezerModel {
  static tableName = "frozenit.freezer";

  static find = async (params = {}) => {
    let sql = `
       SELECT 
           id,
           name_freezer as freezer,
           brand,
           model,
           stars,
           slots,
           notes
       FROM ${this.tableName}`;

    if (!Object.keys(params).length) {
      return queryHandler.default(sql, null);
    }

    // en caso de que enviamos parametros filtramos la select
    const { colString, values } = colValueBinder(params);
    sql += ` WHERE ${colString}`;

    return queryHandler.default(sql, [...values]);
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

    return result[0];
  };

  static insert = async ({
    email,
    name,
    brand = "",
    model = "",
    stars = 5,
    slots = 3,
    notes = "",
  }) => {
    const sql = `INSERT INTO ${this.tableName}
        (users_email, name_freezer, brand, model, stars, slots, notes) VALUES (?,?,?,?,?,?,?)`;

    return await queryHandler.default(sql, [
      email,
      name,
      brand,
      model,
      stars,
      slots,
      notes,
    ]);
  };

  static delete = async (id) => {
    return await queryHandler.default(
      `DELETE FROM ${this.tableName} WHERE id = ?`,
      [id]
    );
  };
}

export { FreezerModel };
