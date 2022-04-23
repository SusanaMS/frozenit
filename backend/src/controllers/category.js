import { CategoryModel } from "../models/category.js";

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
}

export { CategoryController };
