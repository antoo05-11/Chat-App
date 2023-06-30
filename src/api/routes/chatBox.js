import {
    Router
} from "express";
import {
    getAllNotes
} from "../api/controllers/chatBoxController";

const chatBoxRoute = Router();

chatBoxRoute.get("/", getAllNotes);

export default chatBoxRoute;