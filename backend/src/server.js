import express from 'express';
import dotenv from 'dotenv';

// MODULOS PROPIOS
import {Connection} from "./db/connection.js";

// Init express
const app = express();

// Obtiene las variables de entorno desde el fichero .env y las carga en process.env
dotenv.config();

// Conectamos a BBDD
const connection = new Connection(
    process.env.HOST,
    process.env.DB_USER,
    process.env.DB_PASS,
    process.env.DB_DATABASE
)
connection.checkConnection()

// en process.env se almacenan como diccionario las claves
// contenidas en el fichero .env

// en caso de que PORT no exista o este vacío se usara el puero 3331
const port = Number(process.env.PORT || 3331);

// endpoint para testear
app.get('/hello', (req, res) => {
    res.send('Hello World!')
})


// Arrancamos el servidor ecuchando por el puerto antes indicado
app.listen(port, () =>
    console.log(`Running on port ${port}!`));

export { app }