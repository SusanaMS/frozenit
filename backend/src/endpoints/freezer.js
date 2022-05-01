import { Router as EndPointRouter } from "express";
import { FreezerController } from "../controllers/freezer.js";
import { validateAddFreezer } from "../middleware/validators/freezer.js";
import { auth } from "../middleware/auth.js";

// https://expressjs.com/es/api.html#express.router
const freezerEndPoint = EndPointRouter({ caseSensitive: true });

// http://localhost:3000/api/v1/freezer/all/
freezerEndPoint.get("/all/", FreezerController.getAllFreezers);

freezerEndPoint.get(
  "/email/:email",
  auth(),
  FreezerController.getFreezerByUser
);

freezerEndPoint.post("/add", validateAddFreezer, FreezerController.addFreezer);

freezerEndPoint.delete("/id/:id", FreezerController.deleteFreezer);

export { freezerEndPoint };
