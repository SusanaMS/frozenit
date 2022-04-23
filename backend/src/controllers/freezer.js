import { FreezerModel } from "../models/freezer.js";

class FreezerController {
  static getAllFreezers = async (req, res, next) => {
    // esperamos a que se resuelva la Query con un await
    let freezerList = await FreezerModel.find();
    // en caso de que el array devuelto no tenga contenido arrojamos una excepction
    if (!freezerList.length) {
      res.status(400).send({
        message: "No se han encotrado frigorificos",
      });
    }
    // devolvemos la lista sin los metadatatos
    res.send(freezerList[0]);
  };
}

export { FreezerController };
