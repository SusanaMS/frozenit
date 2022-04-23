import {Router as EndPointRouter} from 'express';
import {UserController} from "../controllers/user.js";

// https://expressjs.com/es/api.html#express.router
const userEndPoint = EndPointRouter({caseSensitive: true});

// http://localhost:3000/api/v1/users/all/
userEndPoint.get('/all/' , UserController.getAllUsers);

export { userEndPoint }
