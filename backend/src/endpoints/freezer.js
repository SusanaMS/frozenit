import { Router as EndPointRouter } from "express";
import { FreezerController } from "../controllers/freezer.js";

// https://expressjs.com/es/api.html#express.router
const freezerEndPoint = EndPointRouter({ caseSensitive: true });

// http://localhost:3000/api/v1/freezer/all/
freezerEndPoint.get("/all/", FreezerController.getAllFreezers);

export { freezerEndPoint };
