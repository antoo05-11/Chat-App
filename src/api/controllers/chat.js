import io from "../../server";
import HttpException from "../exceptions/http-exception";
import User from "../models/user";
import {
    requestRefreshToken
} from "./auth";
import Message from "../models/message";

export const getAllChats = async (req, res) => {
    let user = req.user;
    let conversation = user.conversation;
    res.status(200).json(user);
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
    io.on('connection', (socket) => {
        socket.on('request-conversation', (conversationID) => {
            Message.find({
                    conversationID: conversationID
                })
                .then((message) => {
                    socket.emit('response-conversation', message);
                })
                .catch((error) => {
                    console.error('Lỗi truy vấn dữ liệu:', error);
                });
        })
    })
    io.on('connection', (socket) => {
        socket.on('new-message', (msg) => {
            const currentDate = new Date();
            let newMessage = new Message({
                conversationID: msg.conversationID,
                sender: msg.sender,
                content: msg.content,
                dateTime: currentDate.toISOString()
            })
            newMessage.save().then(() => {
                    console.log('Message inserted successfully');
                })
                .catch((error) => {
                    console.error('Failed to insert new message:', error);
                });
        })
    })
};