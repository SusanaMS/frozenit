import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// MODULOS PROPIOS
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#import_a_module_for_its_side_effects_only
// la primera importación del modulo de conexión a la BBDD se realiza solo
// para comprobar la conectividad a la BD (side effects)
import "./db/connection.js";

import { userEndPoint } from "./endpoints/user.js";
import { categoryEndPoint } from "./endpoints/category.js";
import { foodEndPoint } from "./endpoints/food.js";
import { freezerEndPoint } from "./endpoints/freezer.js";
import { recordEndPoint } from "./endpoints/record.js";

// Init express
const app = express();

// Obtiene las variables de entorno desde el fichero .env y las carga en process.env
dotenv.config();

// en caso de que PORT no exista o este vacío se usara el puero 3331
const port = Number(process.env.PORT || 3331);

// para poder recibir req content-type: json
app.use(express.json());

// https://developer.mozilla.org/es/docs/Web/HTTP/CORS
// para acceder a recursos seleccionados desde un servidor, en un origen distinto (dominio) al que pertenece

app.use(cors());
app.options("*", cors());

// endpoint para testear
app.get("/hello", (req, res) => {
  res.send("Hello World!");
});

// añadimos los endpoint
app.use(`/api/v1/users`, userEndPoint);
app.use(`/api/v1/foods`, foodEndPoint);
app.use(`/api/v1/categories`, categoryEndPoint);
app.use(`/api/v1/freezers`, freezerEndPoint);
app.use(`/api/v1/records`, recordEndPoint);

// controlamos los posibles 404
app.all("*", (req, res, next) => {
  const errorMessage = "endpoint no accesible";
  console.error(errorMessage);
  res.status(404).json({ error: errorMessage });
  return null;
});
// Arrancamos el servidor ecuchando por el puerto antes indicado
app.listen(port, () => console.log(`Corriendo en el puerto: ${port}!`));

export { app };
