import express from "express";
import chatBoxRoute from "./routes/chatBoxRoute";
import log from "console";
const bodyParser = require('body-parser');

const app = express();
const http = require('http').createServer(app);
app.use(bodyParser.json());

const PORT = process.env.PORT || 5050;

app.use("/src/public", express.static('./src/public/'));

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})

app.use('/chatbox', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
})

app.use('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
})


// Socket for message rooms.
const io = require('socket.io')(http);
io.on('connection', (socket) => {
    console.log('New client connected');
})

// Login
app.post('/api/send-message', function (req, res) {
    const {
        username,
        password
    } = req.body;
    console.log(username + password);
    var botResponse = "Cảm ơn bạn đã gửi tin nhắn!";
});