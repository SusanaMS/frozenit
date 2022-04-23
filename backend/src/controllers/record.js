import { RecordModel } from "../models/record.js";

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
}

export { RecordController };
