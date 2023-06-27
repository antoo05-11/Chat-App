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

app.get('/chatbox', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
})

app.get('/', (req, res) => {
    res.redirect('/login');
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
    let user = {
        username: username,
        password: password
    }
    User.findOne(user)
        .then((foundUser) => {
            if (foundUser) {
                console.log('Đã tìm thấy người dùng trong cơ sở dữ liệu:', foundUser);
                res.redirect('/chatbox');
                io.on('connection', (socket) => {
                    socket.emit('user-info', foundUser);
                })
                let conversation = foundUser.conversation;
                let message = {
                    conversationID: conversation[0]
                }

                Message.find({})
                    .then((message) => {
                        io.on('connection', (socket) => {
                            socket.emit('message', message);
                        })
                    })
                    .catch((error) => {
                        console.error('Lỗi truy vấn dữ liệu:', error);
                    });


            } else {
                console.log('Người dùng không tồn tại trong cơ sở dữ liệu');
            }
        })
        .catch((error) => {
            console.error('Lỗi truy vấn dữ liệu:', error);
        });
});

io.on('connection', (socket) => {
    socket.on('new-message', (msg) => {
        console.log(msg);
        let newMessage = new Message({
            conversationID: 1,
            sender: msg.sender,
            content: msg.content,
            dateTime: ""
        })
        newMessage.save().then(() => {
                console.log('Message inserted successfully');
            })
            .catch((error) => {
                console.error('Failed to insert new message:', error);
            });;
    })
})



// Database
const mongoose = require('mongoose');

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

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    conversation: Array
});

const User = mongoose.model('User', userSchema);

const messageSchema = new mongoose.Schema({
    conversationID: Number,
    dateTime: String,
    sender: Number,
    content: String
});

const Message = mongoose.model('Message', messageSchema);