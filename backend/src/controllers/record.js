import { RecordModel } from "../models/record.js";
import { checkValidation } from "./common/utils.js";

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
    const records = await RecordModel.find(req.params.email);

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

    let params = req.body;
    const { foodId, addDate } = params;

    // se tiene que obtener los días de expiracion
    // para la categoria del elemento a añadir

    const resultExp = await RecordModel.findExpiration(foodId);
    const { expiration_days } = resultExp;

    // calculamos el expiration date y se lo añadimos a los parametros
    const recordExpirationDate = new Date(Date.parse(addDate));
    recordExpirationDate.setDate(
      recordExpirationDate.getDate() + expiration_days
    );

    params.expirationDate = recordExpirationDate.toISOString().slice(0, 10);

    console.log(params);

    const result = await RecordModel.insert(params);
    if (!result[0].affectedRows) {
      res.status(404).json({ error: "error en al registrar en congelador" });
      console.error("error en al registrar en congelador");
      return;
    }

    res.status(201).json({
      mensaje: "registro en congelador correcto",
      fechaExpiracion: params.expirationDate,
    });
  };

  static deleteRecord = async (req, res, next) => {
    const result = await RecordModel.update(req.params.id);
    if (!result[0].affectedRows) {
      res.status(404).json({ error: "error en al registrar en congelador" });
      console.error("error en al registrar en congelador");
      return;
    }

    res.status(201).json({ mensaje: "descongelado correcto" });
  };
}

export { RecordController };
