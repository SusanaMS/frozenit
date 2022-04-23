import { Router as EndPointRouter } from "express";
import { CategoryController } from "../controllers/category.js";

// https://expressjs.com/es/api.html#express.router
const categoryEndPoint = EndPointRouter({ caseSensitive: true });

// http://localhost:3000/api/v1/category/all/
categoryEndPoint.get("/all/", CategoryController.getAllCategories);

// http://localhost:3000/api/v1/category/name/pollo
categoryEndPoint.get("/name/:name", CategoryController.getCategoryByName);

export { categoryEndPoint };
