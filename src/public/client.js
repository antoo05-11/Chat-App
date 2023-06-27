const socket = io()

let textarea = document.querySelector('#user-textfield')
let sendButton = document.querySelector('#send-button')
let messageArea = document.querySelector('.chat-container')

textarea.addEventListener('keyup', (e) => {
    if (e.key === "Enter") {
        sendMessage(e.target.value);
    }
})

sendButton.addEventListener('click', (e) => {
    let newMsg = {
        name: userInfo.username,
        content: textarea.value
    }

    sendMessage(newMsg);
})

function sendMessage(newMsg) {
    console.log(userInfo);
    msg = {
        sender: userInfo.userID,
        content: newMsg.content
    }

    socket.emit('new-message', msg);
    appendMessage(msg);
}

function appendMessage(msg) {
    var mainDiv = document.createElement('div');
    mainDiv.classList.add('message', 'bot-message');
    if (msg.sender === userInfo.userID)
        mainDiv.textContent = userInfo.username + ": " + msg.content;
    else mainDiv.textContent = msg.sender + ": " + msg.content;
    messageArea.scrollTop = messageArea.scrollHeight;
    messageArea.appendChild(mainDiv);
}

let userInfo;
socket.on('user-info', (info) => {
    userInfo = info;
})

socket.on('message', (message) => {
    message.forEach(element => {
        let msg;
        if (userInfo.userID === element.sender) {
            msg = {
                sender: userInfo.username,
                content: element.content
            }

        } else {
            msg = {
                sender: element.sender,
                content: element.content
            }
        }
        appendMessage(msg);
    });
});

let currentConversationID = 1;