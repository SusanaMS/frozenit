import express from 'express';
import dotenv from 'dotenv';

// MODULOS PROPIOS
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#import_a_module_for_its_side_effects_only
// la primera importación del modulo de conexión a la BBDD se realiza solo
// para comprobar la conectividad a la BD (side effects)
import "./db/connection.js";

import {userEndPoint} from "./endpoints/user.js";

// Init express
const app = express();

// Obtiene las variables de entorno desde el fichero .env y las carga en process.env
dotenv.config();

// en caso de que PORT no exista o este vacío se usara el puero 3331
const port = Number(process.env.PORT || 3331);

// endpoint para testear
app.get('/hello', (req, res) => {
    res.send('Hello World!')
})

// añadimos los endpoint de usuario
app.use(`/api/v1/users`, userEndPoint);

// Arrancamos el servidor ecuchando por el puerto antes indicado
app.listen(port, () =>
    console.log(`Running on port ${port}!`));

export { app }