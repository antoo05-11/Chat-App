import Message from "../models/message";
import Conversation from "../models/conversation";
import User from "../models/user";

const messages = [];

export const appSocket = (io) => {
    io.on('connection', (socket) => {
        socket.on('join-room', (roomName) => {
            socket.join(roomName);
        });
        socket.on('add-user', (userID) => {
            socket.join(userID);
        });

        socket.on('request-conversation', async (req) => {
            let conversationID = req.conversationID;
            await Conversation.findById(conversationID)
                .then((conversation) => {
                    Message.find({
                            conversationID: conversationID
                        })
                        .then(async (messages) => {
                            let usersList = [];

                            for (const userID of conversation.users) {
                                try {
                                    const user = await User.findById(userID);
                                    usersList.push(user);
                                } catch (error) {
                                    console.error('Lỗi truy vấn dữ liệu:', error);
                                }
                            }

                            io.to(req.requester).emit('response-conversation', {
                                conversation: conversation,
                                messages: messages,
                                users: usersList
                            });
                        })
                })
                .catch((error) => {
                    console.error('Lỗi truy vấn dữ liệu:', error);
                });
        })

        socket.on('new-message', (message) => {
            if (!messages.includes(message)) {
                messages.push(message);
                let roomID = 'room-' + message.conversationID;
                socket.broadcast.to(roomID).emit(roomID + 'message', message);
                let newMessage = new Message({
                    conversationID: message.conversationID,
                    sender: message.sender,
                    content: message.content,
                    dateTime: message.dateTime
                })
                newMessage.save()
                    .catch((error) => {
                        console.error('Failed to insert new message:', error);
                    });

                let newLastUpdated = newMessage.dateTime;
                Conversation.findById(newMessage.conversationID)
                    .then((conversation) => {
                        if (!conversation) {
                            console.log('Không tìm thấy đối tượng Conversation');
                            return;
                        }
                        if (newLastUpdated > conversation.lastUpdated || !conversation.lastUpdated) {
                            conversation.lastUpdated = newLastUpdated;
                            return conversation.save();
                        }
                    })
                    .catch((error) => {
                        console.error('Lỗi khi tìm kiếm hoặc cập nhật đối tượng Conversation:', error);
                    });
            }
        });
    })
}