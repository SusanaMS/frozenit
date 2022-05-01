import { RecordModel } from "../models/record.js";
import { checkValidation } from "./common/utils.js";
import { FoodModel } from "../models/food.js";

class RecordController {
  static getAllRecords = async (req, res, next) => {
    // esperamos a que se resuelva la Query con un await
    let recordList = await RecordModel.find();
    // en caso de que el array devuelto no tenga contenido arrojamos una excepction
    if (!recordList.length) {
      res.status(400).send({
        message: "No se han encotrado registros",
      });
    }
    // devolvemos la lista sin los metadatatos
    res.send(recordList[0]);
  };

  static getRecordsByUser = async (req, res, next) => {
    const records = await RecordModel.find({
      users_email: req.params.email,
    });

    if (!records.length) {
      res.status(404).json({ error: "no se han encontrado registros" });
      console.error("no se han encontrado registros");
      return;
    }
    res.send(records[0]);
  };

  static addRecord = async (req, res, next) => {
    const isReqValid = checkValidation(req);

    if (isReqValid != null) {
      res.status(404).json({ error: isReqValid });
      return;
    }
    console.log(req.body);

    const { foodId, addDate } = req.body;

    console.log(foodId);

    // se tiene que obtener los días de expiracion
    // para la categoria del elemento a añadir

    const result = await RecordModel.findExpiration(foodId);
    const { expiration_days } = result;
    const recordExpirationDate = new Date(Date.parse(addDate));
    recordExpirationDate.setDate(
      recordExpirationDate.getDate() + expiration_days
    );

    console.debug(
      expiration_days,
      recordExpirationDate.toISOString().slice(0, 10)
    );

    res.status(404).json({ error: "prueba" });
  };
}

export { RecordController };
