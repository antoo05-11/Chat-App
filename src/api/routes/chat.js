import {
    Router
} from "express";
import {
    getAllChats
} from "../controllers/chat";
import {
    verifyToken
} from "../middlewares/verify-token";

const chatRoute = Router();

chatRoute.post("/", verifyToken, getAllChats);

export default chatRoute;