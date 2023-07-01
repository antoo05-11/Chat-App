import Message from "../models/message";

const messages = [];

export const appSocket = (io) => {
    io.on('connection', (socket) => {
        socket.on('join-room', (roomName) => {
            socket.join(roomName);
        });
        socket.on('add-user', (userID) => {
            socket.join(userID);
        });

        socket.on('request-conversation', (req) => {
            let conversationID = req.conversationID;
            Message.find({
                    conversationID: conversationID
                })
                .then((message) => {
                    io.to(req.requester).emit('response-conversation', message);
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
                const currentDate = new Date();
                let newMessage = new Message({
                    conversationID: message.conversationID,
                    sender: message.sender,
                    content: message.content,
                    dateTime: currentDate.toISOString()
                })
                newMessage.save().then(() => {
                        console.log('Message inserted successfully');
                    })
                    .catch((error) => {
                        console.error('Failed to insert new message:', error);
                    });
            }
        });
    })
}