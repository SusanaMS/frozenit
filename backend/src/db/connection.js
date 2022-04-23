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
            debug: false
        });

        // una vez que creamos el Pool de conexión testeamos el acceso a BD
        this.checkConnection()
    }

    checkConnection() {
        this.db.getConnection((err, connection) => {
            if (connection) {
                console.error('Conectado a la BBDD');
                connection.release();
                // realizamos una query de testeo
                this.queryHandler('SELECT "CONEXION OK!!"').then(r => console.log(r))
            }

            if (err) {
                switch (err.code) {
                    case 'PROTOCOL_CONNECTION_LOST':
                        console.error('Se ha cerrado la conexión contra la BD');
                        break;
                    case 'ECONNREFUSED':
                        console.error('La conexión contra la BD ha sido rechazada');
                        break;
                    case 'ER_CON_COUNT_ERROR':
                        console.error('Demasiada carga de conexiones contra la BD');
                        break;
                    default:
                        console.error(`Error de conexión a la BD ${err.message}`);
                }
            }
        });
    }
    // https://www.npmjs.com/package/mysql2#using-promise-wrapper
    // construimos un manejador asicrono de queries
    queryHandler = async (sql, values) => {
        return await this.db.promise().query(sql, values)
    }

}

// exportamos como default la función manejadora de queries
export default new Pool().queryHandler