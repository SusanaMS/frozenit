import { CategoryModel } from "../models/category.js";
import { checkValidation } from "./common/utils.js";

class CategoryController {
  static getAllCategories = async (req, res, next) => {
    // esperamos a que se resuelva la Query con un await
    let categoryList = await CategoryModel.find();

    // en caso de que el array devuelto no tenga contenido arrojamos una excepction
    if (!categoryList.length) {
      res.status(400).send({
        message: "No se han encotrado categorias",
      });
    }
    // devolvemos la lista sin los metadatatos
    res.send(categoryList[0]);
  };

  static getCategoryByName = async (req, res, next) => {
    const category = await CategoryModel.findOne({
      name_category: req.params.name,
    });
    if (category.length !== 1) {
      res.status(400).send({
        message: "No se ha encontrado la categoría",
      });
    }
    res.send(category[0]);
  };
  static addCategory = async (req, res, next) => {
    const isReqValid = checkValidation(req);

    if (isReqValid != null) {
      res.status(404).json({ error: isReqValid });
      return;
    }

    const result = await CategoryModel.insert(req.body);
    console.log("addCategory result", result);

    if (!result[0].affectedRows) {
      res.status(404).json({ error: "error en alta de categoria" });
      console.error("error en alta de categoria");
      return;
    }
    res.status(201).json({ mensaje: "alta de categoria correcta" });
  };

  static deleteCategory = async (req, res, next) => {
    const result = await CategoryModel.delete(req.params.name);
    if (!result[0].affectedRows) {
      res.status(404).json({ error: "error en baja de categoria" });
      console.error("error en baja de categoria");
      return;
    }
    res.status(201).json({ mensaje: "baja de categoria correcta" });
  };
}

export { CategoryController };
