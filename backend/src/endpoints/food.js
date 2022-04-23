import { Router as EndPointRouter } from "express";
import { FoodController } from "../controllers/food.js";
import { validateAddFood } from "../middleware/food/validators.js";

// https://expressjs.com/es/api.html#express.router
const foodEndPoint = EndPointRouter({ caseSensitive: true });

// http://localhost:3000/api/v1/foods/all/
foodEndPoint.get("/all/", FoodController.getAllFoods);
// http://localhost:3000/api/v1/foods/name/pollo
foodEndPoint.get("/name/:name", FoodController.getFoodByName);

foodEndPoint.post("/add", validateAddFood, FoodController.addFood);

foodEndPoint.delete("/id/:id", FoodController.deleteFood);

export { foodEndPoint };
