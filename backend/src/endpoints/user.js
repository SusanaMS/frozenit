import {Router as EndPointRouter} from 'express';
import * as queryHandler from "../db/connection.js";
import {UserModel} from "../models/users.js";

// https://expressjs.com/es/api.html#express.router
const userEndPoint = EndPointRouter({caseSensitive: true});

// http://localhost:3000/api/v1/users/all/
userEndPoint.get('/all/' , function (req, res) {
    UserModel.find().then(r =>  res.send(r[0]) )
});

export { userEndPoint }
