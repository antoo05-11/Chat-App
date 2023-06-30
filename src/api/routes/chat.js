import { Router } from "express";
import { getAllChats } from "../controllers/chat";

const chatRoute = Router();

chatRoute.get("/", getAllChats);

export default chatRoute;