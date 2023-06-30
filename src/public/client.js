const socket = io()
const token = localStorage.getItem('token');
if (token) {
    console.log(token);
} else {

}



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
        conversationID: currentConversationID,
        sender: userInfo.userID,
        content: newMsg.content
    }

    socket.emit('new-message', msg);
    appendMessage(msg);
}

let conversationIDList = [];

function createNewChat(conversationID) {
    let chatListDiv = document.querySelector("#chat-list");
    var newChatDiv = document.createElement('div');
    newChatDiv.classList.add('short-conversation');
    newChatDiv.textContent = "Conversation " + conversationID;
    chatListDiv.appendChild(newChatDiv);
    conversationIDList.push(conversationID);

    newChatDiv.addEventListener('click', (e) => {
        currentConversationID = conversationID;
        socket.emit('request-conversation', conversationID);
        messageArea.replaceChildren();
    })
}

socket.on(('response-conversation'), (messages) => {
    console.log(messages);
    if (messages.length > 0) {
        if (messages[0].conversationID === currentConversationID) {
            messages.forEach(message => {
                let msg;
                if (userInfo.userID === message.sender) {
                    msg = {
                        sender: userInfo.username,
                        content: message.content
                    }
                } else {
                    msg = {
                        sender: message.sender,
                        content: message.content
                    }
                }
                appendMessage(msg);
            });
        }
    }
})

let currentConversationID = 1;

function appendMessage(msg) {
    var mainDiv = document.createElement('div');
    mainDiv.classList.add('message', 'bot-message');
    if (msg.sender === userInfo.userID)
        mainDiv.textContent = userInfo.username + ": " + msg.content;
    else mainDiv.textContent = msg.sender + ": " + msg.content;
    messageArea.scrollTop = messageArea.scrollHeight;
    messageArea.appendChild(mainDiv);
}

// After login, get user info response from server and init conversations list.
let userInfo;
socket.on('user-info', (info) => {
    userInfo = info;
    info.conversation.forEach(conversationID => {
        console.log(userInfo);
        if (!conversationIDList.includes(conversationID))
            createNewChat(conversationID);
    });
})

fetch('/api/chat', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            user: {
                username: "",
                password: ""
            }
        })
    })
    .then(function (response) {
        response.json()
            .then(function (data) {
                if (response.status === 200) {
                    console.log(data);
                } else {

                }
            })
            .catch(function (error) {
                console.error('Error:', error);
            });
    })
    .catch(function (error) {
        console.error('Error:', error);
    });