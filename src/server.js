import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./api/routes";
import bodyParser from "body-parser";

dotenv.config();

var http = require('http');
var app = express();
var server = http.createServer(app);

// Register middleware
app.use(express.json());
app.use(cookieParser());

// Static files
app.use("/src/public", express.static('./src/public/'));
app.use(cors());

// Error handler
app.use((err, req, res, next) => {
    const {
        status = 404, message = "Error"
    } = err;
    res.status(status).json({
        message
    });
});

const PORT = process.env.PORT || 5050;;
server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})
var io = require('socket.io')(server);
export default io;

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to express"
    });
});

app.use("/api", router);

app.use('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
})
app.use('/chat', (req, res) => {
    res.sendFile(__dirname + '/public/chat.html')
})

// Database
const mongoose = require('mongoose');
(async () => {
    mongoose.connect('mongodb://localhost:27017/chat-app', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log('Kết nối đến MongoDB thành công');
        })
        .catch((error) => {
            console.error('Lỗi kết nối đến MongoDB:', error);
        });
})();

// Socket for message rooms.
// const io = require('socket.io')(http);
// io.on('connection', (socket) => {
//     console.log('New client connected');
// })

// // Login
// app.post('/api/send-message', function (req, res) {
//     const {
//         username,
//         password
//     } = req.body;
//     let user = {
//         username: username,
//         password: password
//     }
//     User.findOne(user)
//         .then((foundUser) => {
//             if (foundUser) {
//                 console.log('Đã tìm thấy người dùng trong cơ sở dữ liệu:', foundUser);
//                 res.redirect('/chatbox');

//                 io.on('connection', (socket) => {
//                     socket.emit('user-info', foundUser);
//                 })

//                 let conversation = foundUser.conversation;
//                 conversation.forEach(element => {
//                     Message.find({
//                             conversationID: element
//                         })
//                         .then((message) => {
//                             io.on('connection', (socket) => {
//                                 socket.emit('message', message);
//                             })
//                         })
//                         .catch((error) => {
//                             console.error('Lỗi truy vấn dữ liệu:', error);
//                         });
//                 });
//             } else {
//                 console.log('Người dùng không tồn tại trong cơ sở dữ liệu');
//             }
//         })
//         .catch((error) => {
//             console.error('Lỗi truy vấn dữ liệu:', error);
//         });
// });

// io.on('connection', (socket) => {
//     socket.on('new-message', (msg) => {
//         const currentDate = new Date();
//         let newMessage = new Message({
//             conversationID: msg.conversationID,
//             sender: msg.sender,
//             content: msg.content,
//             dateTime: currentDate.toISOString()
//         })
//         newMessage.save().then(() => {
//                 console.log('Message inserted successfully');
//             })
//             .catch((error) => {
//                 console.error('Failed to insert new message:', error);
//             });
//     })
// })

// io.on('connection', (socket) => {
//     socket.on('request-conversation', (conversationID) => {
//         Message.find({
//                 conversationID: conversationID
//             })
//             .then((message) => {
//                 socket.emit('response-conversation', message);
//             })
//             .catch((error) => {
//                 console.error('Lỗi truy vấn dữ liệu:', error);
//             });
//     })
// })