import Router from "express";
import {
    login
} from "../controllers/login";
import catchAsync from "../exceptions/catch-async";


const loginRoute = Router();

loginRoute.get('/', catchAsync(login));

export default loginRoute;