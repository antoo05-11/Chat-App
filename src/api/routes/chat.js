import {
    Router
} from "express";
import {
    addChat,
    getAllChats
} from "../controllers/chat";
import {
    verifyToken
} from "../middlewares/verify-token";

const chatRoute = Router();

chatRoute.post("/", verifyToken, getAllChats);
chatRoute.post("/add", verifyToken, addChat);

export default chatRoute;