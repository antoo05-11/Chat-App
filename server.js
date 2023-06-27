const express = require('express');
const app = express();
const http = require('http').createServer(app);

const PORT = process.env.PORT || 5050;

app.use("/public", express.static('./public/'));

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
})

const io = require('socket.io')(http);

io.on('connection', (socket) => {
    console.log('New client connected');
})