import { Router as EndPointRouter } from "express";
import { FoodController } from "../controllers/food.js";
import { validateAddFood } from "../middleware/validators/food.js";
import { auth } from "../middleware/auth.js";

// https://expressjs.com/es/api.html#express.router
const foodEndPoint = EndPointRouter({ caseSensitive: true });

// http://localhost:3000/api/v1/foods/all/
foodEndPoint.get("/all/", auth(), FoodController.getAllFoods);
// http://localhost:3000/api/v1/foods/name/pollo
foodEndPoint.get("/name/:name", auth(), FoodController.getFoodByName);

foodEndPoint.post("/add", auth(), validateAddFood, FoodController.addFood);

foodEndPoint.delete("/id/:id", auth(), FoodController.deleteFood);

export { foodEndPoint };
