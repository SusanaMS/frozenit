import { Router as EndPointRouter } from "express";
import { CategoryController } from "../controllers/category.js";
import { validateAddCategory } from "../middleware/validators/category.js";
import { auth } from "../middleware/auth.js";

// https://expressjs.com/es/api.html#express.router
const categoryEndPoint = EndPointRouter({ caseSensitive: true });

// http://localhost:3000/api/v1/category/all/
categoryEndPoint.get("/all/", auth(), CategoryController.getAllCategories);

// http://localhost:3000/api/v1/category/name/pollo
categoryEndPoint.get(
  "/name/:name",
  auth(),
  CategoryController.getCategoryByName
);

categoryEndPoint.post(
  "/add",
  auth(),
  validateAddCategory,
  CategoryController.addCategory
);

categoryEndPoint.delete(
  "/name/:name",
  auth(),
  CategoryController.deleteCategory
);

export { categoryEndPoint };
