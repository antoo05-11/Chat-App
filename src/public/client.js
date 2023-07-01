const socket = io()
let token = localStorage.getItem("token");
var userInfo;

let textarea = document.querySelector('#user-textfield');
let sendButton = document.querySelector('#send-button');
let messageArea = document.querySelector('.chat-container');
let usernameDiv = document.querySelector('#username');

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
    if (newMsg.content.length > 0) {
        let msg = {
            conversationID: currentConversationID,
            sender: userInfo._id,
            content: newMsg.content
        }
        socket.emit('new-message', msg);
        textarea.value = '';
        appendMessage(msg);
    }
}

let conversationIDList = [];

function createNewChat(conversationID) {
    let chatListDiv = document.querySelector("#chat-list");
    var newChatDiv = document.createElement('div');
    newChatDiv.classList.add('short-conversation');
    chatListDiv.appendChild(newChatDiv);
    conversationIDList.push(conversationID);

    let usernameLabelDiv = document.createElement('p');
    usernameLabelDiv.textContent = "Conversation " + conversationID;
    let previewChatDiv = document.createElement('p');
    previewChatDiv.textContent = "Preview chat";

    newChatDiv.appendChild(usernameLabelDiv);
    newChatDiv.appendChild(previewChatDiv);


    newChatDiv.addEventListener('click', (e) => {
        currentConversationID = conversationID;
        let req = {
            conversationID: conversationID,
            requester: userInfo._id
        }
        socket.emit('request-conversation', req);
        messageArea.replaceChildren();
    })
}


socket.on(('response-conversation'), (messages) => {
    if (messages.length > 0) {
        if (messages[0].conversationID === currentConversationID) {
            messages.forEach(message => {
                let msg;
                if (userInfo._id === message.sender) {
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
    if (msg.sender === userInfo._id)
        mainDiv.textContent = "You: " + msg.content;
    else mainDiv.textContent = msg.sender + ": " + msg.content;
    messageArea.appendChild(mainDiv);
    messageArea.scrollTop = messageArea.scrollHeight;
}

fetch('/api/chat', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({

        })
    })
    .then(function (response) {
        response.json()
            .then(function (data) {
                if (response.status === 200) {
                    userInfo = data;
                    console.log(usernameDiv);
                    usernameDiv.textContent = userInfo.username;
                    socket.emit('add-user', userInfo._id);
                    data.conversation.forEach(conversationID => {
                        if (!conversationIDList.includes(conversationID)) {
                            socket.emit('join-room', 'room-' + conversationID);
                            socket.on('room-' + conversationID + 'message', (message) => {
                                let msg;
                                if (userInfo._id === message.sender) {
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
                            createNewChat(conversationID);
                        }
                    });
                } else {

                }
            })
            .catch(function (error) {
                console.error('Error:', error);
                window.location.href = '/login';
            });
    })
    .catch(function (error) {
        console.error('Error:', error);
    });

let findTextfield = document.querySelector('#find-textfield');
let findListDiv = document.querySelector('#find-list');
findTextfield.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        findListDiv.replaceChildren();
        fetch('/api/user/find', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    input: findTextfield.value,
                })
            })
            .then(function (response) {
                response.json()
                    .then(function (data) {
                        if (response.status === 200) {
                            console.log(data);
                            data.forEach(user => {
                                appendFoundUser(user);
                            });
                        }
                    })
                    .catch(function (error) {
                        console.error('Error:', error);
                    });
            })
            .catch(function (error) {
                console.error('Error:', error);
            });
    }
})

function appendFoundUser(user) {
    let foundUserDiv = document.createElement('div');
    foundUserDiv.classList.add('short-conversation');
    foundUserDiv.textContent = "Found: " + user.username;
    findListDiv.appendChild(foundUserDiv);

    foundUserDiv.addEventListener('click', (e) => {
        fetch('/api/chat/add', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: user.username
                })
            })
            .then(function (response) {
                response.json()
                    .then(function (data) {
                        if (response.status === 200) {
                            console.log(data);
                            if (!conversationIDList.includes(data._id)) {
                                createNewChat(data._id);
                                currentConversationID = data.id;
                            } else {

                            }
                        }
                    })
                    .catch(function (error) {
                        console.error('Error:', error);
                    });
            })
            .catch(function (error) {
                console.error('Error:', error);
            });
    })
}

function logout() {
    fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        })
        .then(function (response) {
            response.json()
                .then(function (data) {
                    if (response.status === 200) {
                        localStorage.clear(token);
                        window.location.href = '/login';
                    }
                })
                .catch(function (error) {
                    console.error('Error:', error);
                });
        })
        .catch(function (error) {
            console.error('Error:', error);
        });
}