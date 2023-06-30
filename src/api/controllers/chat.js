import io from "../../server";
import HttpException from "../exceptions/http-exception";
import User from "../models/user";
import { requestRefreshToken } from "./auth";

export const getAllChats = async (req, res) => {
    console.log(req.body);
    user = req.body.user;
    let conversation = user.conversation;
    conversation.forEach(element => {
        Message.find({
                conversationID: element
            })
            .then((message) => {
                io.on('connection', (socket) => {
                    socket.emit('message', message);
                })
            })
            .catch((error) => {
                console.error('Lỗi truy vấn dữ liệu:', error);
            });
    });
}; 