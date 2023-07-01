import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./api/routes";
import bodyParser from "body-parser";
import {
    appSocket
} from "./api/socket/socket";

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
appSocket(io);
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