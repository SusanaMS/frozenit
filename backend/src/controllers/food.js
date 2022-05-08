import { FoodModel } from "../models/food.js";
import { checkValidation } from "./common/utils.js";

class FoodController {
  static getAllFoods = async (req, res, next) => {
    // esperamos a que se resuelva la Query con un await
    let foodList = await FoodModel.find();
    // en caso de que el array devuelto no tenga contenido arrojamos una excepction
    if (foodList === null || !foodList.length) {
      res.status(400).send({
        message: "No se han encotrado comidas",
      });
    }
    // devolvemos la lista sin los metadatatos
    res.send(foodList[0]);
  };

  static getFoodByName = async (req, res, next) => {
    const food = await FoodModel.findOne({ name_food: req.params.name });
    if (food === null || food.length !== 1) {
      res.status(400).send({
        message: "No se ha encontrado la comida",
      });
    }
    res.send(food[0]);
  };

  static addFood = async (req, res, next) => {
    const isReqValid = checkValidation(req);

    if (isReqValid != null) {
      res.status(404).json({ error: isReqValid });
      return;
    }

    console.log("req.body:", req.body);

    const result = await FoodModel.insert(req.body);
    console.log("food result", result);

    if (result === null || !result[0].affectedRows) {
      res
        .status(404)
        .json({ error: "error en alta de alimento. Posible duplicado" });
      console.error("error en alta de alimento");
      return;
    }

    res.status(201).json({ mensaje: "alta de alimento correcta" });
  };

  static deleteFood = async (req, res, next) => {
    const result = await FoodModel.delete(req.params.id);
    if (result === null || !result[0].affectedRows) {
      res.status(404).json({ error: "error en baja de alimento" });
      console.error("error en baja de alimento");
      return;
    }
    res.status(201).json({ mensaje: "baja de alimento correcta" });
  };
}

export { FoodController };
