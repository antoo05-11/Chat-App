import {
    Router
} from "express";
import {
    getAllNotes
} from "../controllers/chatBoxController";

const chatBoxRoute = Router();

chatBoxRoute.get("/", getAllNotes);

export default chatBoxRoute;