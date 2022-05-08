import { FreezerModel } from "../models/freezer.js";
import { checkValidation } from "./common/utils.js";

class FreezerController {
  static getAllFreezers = async (req, res, next) => {
    // esperamos a que se resuelva la Query con un await
    let freezerList = await FreezerModel.find();
    // en caso de que el array devuelto no tenga contenido arrojamos una excepction
    if (freezerList === null || !freezerList.length) {
      res.status(400).send({
        message: "No se han encotrado frigorificos",
      });
    }
    // devolvemos la lista sin los metadatatos
    res.send(freezerList[0]);
  };

  static getFreezerByUser = async (req, res, next) => {
    const freezer = await FreezerModel.find({
      users_email: req.params.email,
    });
    console.log(freezer, "<<<<<");
    if (freezer === null || !freezer.length) {
      res.status(404).json({ error: "no se ha encontrado el frigorifico" });
      console.error("error: no se ha encontrado el frigorifico");
      return;
    }
    res.send(freezer[0]);
  };

  static addFreezer = async (req, res, next) => {
    const isReqValid = checkValidation(req);

    if (isReqValid != null) {
      res.status(404).json({ error: isReqValid });
      return;
    }

    const result = await FreezerModel.insert(req.body);
    console.log("addFreezer result", result);

    if (result === null || !result[0].affectedRows) {
      res.status(404).json({ error: "error en alta de frigorifico" });
      console.error("error en alta de frigorifico");
      return;
    }

    res.status(201).json({ mensaje: "alta de frigorifico correcta" });
  };

  static deleteFreezer = async (req, res, next) => {
    const result = await FreezerModel.delete(req.params.id);
    if (result === null || !result[0].affectedRows) {
      res.status(404).json({ error: "error en baja de frigorifico" });
      console.error("error en baja de frigorifico");
      return;
    }
    res.status(201).json({ mensaje: "baja de frigorifico correcta" });
  };
}

export { FreezerController };
