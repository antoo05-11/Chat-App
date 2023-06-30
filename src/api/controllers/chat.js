import io from "../../server";
import HttpException from "../exceptions/http-exception";
import User from "../models/user";

export const getAllChats = async (req, res) => {
    accessToken = req.accessToken;
    const user = await User.findOne({
        accessToken
    });
    if (!user) throw new HttpException(404, "User not found");
    
    res.json(user);

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