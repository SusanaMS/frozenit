import * as queryHandler from  "../db/connection.js";

class UserModel {
    static tableName = 'users';

    static find = async (params = {}) => {
        let sql = `SELECT * FROM ${this.tableName}`;

        console.log(sql);
        return queryHandler.default(sql, null).then(r => r);
    }

}

export { UserModel }