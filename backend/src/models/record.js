import * as queryHandler from "../db/connection.js";
import { colValueBinder } from "../db/utils.js";

class RecordModel {
  static tableName = "records";

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

  static insert = async ({ email, freezerId, foodId = "" }) => {
    const sql = `INSERT INTO ${this.tableName}
        (users_email, freezer_id, foods_id) VALUES (?,?,?)`;

    return await queryHandler.default(sql, [email, freezerId, foodId]);
  };
}

export { RecordModel };
