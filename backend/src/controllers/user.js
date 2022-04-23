import {UserModel} from "../models/users.js";
import {EndPointNotFoundException} from "../exceptions/EndPointNotFoundException.js";

class UserController {
    static getAllUsers = async (req, res, next) => {
        // esperamos a que se resuelva la Query con un awit
        let userList = await UserModel.find();
        // en caso de que el array devuelto no tenga contenido arrojamos una excepction
        if (!userList.length) {
            throw new EndPointNotFoundException(404, 'No se han encontrado usuarios');
        }
        // devolvemos la lista sin los metadatatos
        res.send(userList[0]);
    };
}

export { UserController }