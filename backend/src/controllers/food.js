import {FoodModel} from "../models/food.js";

class FoodController {
    static getAllFoods = async (req, res, next) => {
        // esperamos a que se resuelva la Query con un await
        let foodList = await FoodModel.find();
        // en caso de que el array devuelto no tenga contenido arrojamos una excepction
        if (!foodList.length) {
            res.status(400).send({
                message: 'No se han encotrado comidas'
            });
        }
        // devolvemos la lista sin los metadatatos
        res.send(foodList[0]);
    };

    static getFoodByName = async (req, res, next) => {
        const food = await FoodModel.findOne({ name_food: req.params.name });
        if (food.length !== 1) {
            res.status(400).send({
                message: 'No se ha encontrado la comida'
            });
        }
        res.send(food[0]);
    };

}

export { FoodController }
