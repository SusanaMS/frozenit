import * as queryHandler from "../db/connection.js";
import { colValueBinder } from "../db/utils.js";

class RecordModel {
  static tableName = "frozenit.records";

  static find = async (email) => {
    let sql = `
       SELECT
         id_record as ID,
         (SELECT name_freezer FROM freezer WHERE id=records.freezer_id) as freezer,
         (SELECT name_food FROM foods WHERE id =records.foods_id) as food,
         IFNULL(slot, 1) as slot,
         DATE_FORMAT(add_date, '%Y-%m-%d') AS congelado,
         DATE_FORMAT(expiration_date, '%Y-%m-%d') AS caduca,
         DATEDIFF(expiration_date, CURDATE()) as dias,
         CASE
           WHEN DATEDIFF(expiration_date, CURDATE()) <= 0 THEN 'EXPIRED'
           WHEN DATEDIFF(expiration_date, CURDATE())  <= (SELECT days from alerts WHERE  level='CRITICAL') THEN 'CRITICAL'
           WHEN DATEDIFF(expiration_date, CURDATE())  <= (SELECT days from alerts WHERE  level='WARNING') THEN 'WARNING'
           ELSE 'NORMAL'
         END as alert
       FROM records WHERE is_deleted = 0`;

    if (email == null) {
      return queryHandler.default(sql, null);
    }

    sql += ` AND users_email = ?`;

    return queryHandler.default(sql, [email]);
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

  static findExpiration = async (foodId) => {
    const sql = `
      SELECT expiration_days
        FROM categories
      WHERE name_category = (
        select categories_name_category from foods where id = ?)`;

    // pasamos el SQL con el BIND a los valores
    const result = await queryHandler.default(sql, [foodId]);

    return result[0][0];
  };

  static insert = async ({
    email,
    freezerId,
    foodId,
    addDate,
    expirationDate,
  }) => {
    const sql = `INSERT INTO ${this.tableName}
        (users_email, freezer_id, foods_id, add_date, expiration_date) VALUES (?,?,?,?,?)`;

    return await queryHandler.default(sql, [
      email,
      freezerId,
      foodId,
      addDate,
      expirationDate,
    ]);
  };

  static update = async (id) => {
    const sql = `UPDATE records SET is_deleted = 1 WHERE id_record = ?`;

    return await queryHandler.default(sql, [id]);
  };
}

export { RecordModel };
