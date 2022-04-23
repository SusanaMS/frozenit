import mysql2 from 'mysql2';
import dotenv from 'dotenv';

class Pool {
    constructor(host, dbUser, dbPass, dbDatabase) {
        dotenv.config()

        this.db = mysql2.createPool({
            host:  process.env.HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_DATABASE,
        });

        // una vez que creamos el Pool de conexión testeamos el acceso a BD
        this.checkConnection()
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

// exportamos como default el Pool instanciado
export default new Pool()