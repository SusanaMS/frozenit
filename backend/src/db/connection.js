import mysql2 from 'mysql2'

class Connection {
    constructor(host, dbUser, dbPass, dbDatabase) {

        this.db = mysql2.createPool({
            host: host,
            user: dbUser,
            password: dbPass,
            database: dbDatabase
        });
    }

    checkConnection() {
        this.db.getConnection((err, connection) => {
            if (err) {
                console.error(err);
                if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                    console.error('Database connection was closed.');
                }
                if (err.code === 'ER_CON_COUNT_ERROR') {
                    console.error('Database has too many connections.');
                }
                if (err.code === 'ECONNREFUSED') {
                    console.error('Database connection was refused.');
                }
            }
            if (connection) {
                console.error('Conectado a la BBDD');
                connection.release();
            }
        });
    }
}

export { Connection }