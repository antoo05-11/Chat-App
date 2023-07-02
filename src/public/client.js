const socket = io()
let token = localStorage.getItem("token");
var userInfo;

let textarea = document.querySelector('#user-textfield');
let sendButton = document.querySelector('#send-button');
let messageArea = document.querySelector('.chat-container');
let usernameDiv = document.querySelector('#username');
let chatListDiv = document.querySelector("#chat-list");

textarea.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        sendMessage();
    }
})

sendButton.addEventListener('click', (e) => {
    sendMessage();
})

function sendMessage() {
    if (textarea.value) {
        let msg = {
            conversationID: currentConversationID,
            sender: userInfo._id,
            content: textarea.value,
            dateTime: new Date().toISOString()
        }
        socket.emit('new-message', msg);
        conversations.get(currentConversationID).push(msg);
        initShortConversation(currentConversationID);
        textarea.value = '';
        appendMessage(msg);
    }
}

let currentConversationID;
let conversationIDList = [];
let conversations = new Map();
let conversationInfos = new Map();
let shortConversationDivs = new Map();
let usersList = new Map();

function initConversationsList(conversationID) {
    chatListDiv.replaceChildren();

    conversationIDList.push(conversationID);

    let conversationsArray = Array.from(conversationInfos);
    const compareByLastUpdated = (a, b) => {
        const lastUpdatedA = a[1].lastUpdated;
        const lastUpdatedB = b[1].lastUpdated;

        if (lastUpdatedA < lastUpdatedB) {
            return -1;
        }
        if (lastUpdatedA > lastUpdatedB) {
            return 1;
        }
        return 0;
    };
    conversationsArray.sort(compareByLastUpdated);

    conversationsArray.forEach(conversationInfo => {
        let conversation = conversationInfo[1];
        initShortConversation(conversation._id);
    });
}

function initShortConversation(conversationID) {
    let conversation = conversationInfos.get(conversationID);
    var newChatDiv = document.createElement('div');
    newChatDiv.classList.add('short-conversation');
    chatListDiv.prepend(newChatDiv);

    if (chatListDiv.contains(shortConversationDivs.get(conversationID))) {
        chatListDiv.removeChild(shortConversationDivs.get(conversationID));
        if (conversationID === currentConversationID)
            newChatDiv.classList.add('short-conversation-selected');
    }

    shortConversationDivs.set(conversationID, newChatDiv);

    let usernameLabelDiv = document.createElement('p');
    conversation.users.forEach(userID => {
        if (userID != userInfo._id) {
            usernameLabelDiv.textContent += usersList.get(userID).username;
        }
    });
    if (usernameLabelDiv.textContent === '') usernameLabelDiv.textContent = userInfo.username;

    usernameLabelDiv.classList.add('conversation-label')

    let previewChatDiv = document.createElement('p');
    previewChatDiv.classList.add('preview-label');
    let messagesArray = Array.from(conversations.get(conversationID));
    if (messagesArray.length > 0) {
        const compareByDateTime = (a, b) => {
            const dateTimeA = a.dateTime;
            const dateTimeB = b.dateTime;

            if (dateTimeA < dateTimeB) {
                return 1;
            }
            if (dateTimeA > dateTimeB) {
                return -1;
            }
            return 0;
        };
        messagesArray.sort(compareByDateTime);

        let lastMessage = messagesArray[0];
        let sender = usersList.get(lastMessage.sender).username;
        if (lastMessage.sender === userInfo._id) sender = "You";
        previewChatDiv.textContent = sender + ": " + lastMessage.content;
    } else {
        previewChatDiv.textContent = "No message found..."
    }

    newChatDiv.appendChild(usernameLabelDiv);
    newChatDiv.appendChild(previewChatDiv);

    newChatDiv.addEventListener('click', (e) => {
        if (shortConversationDivs.has(currentConversationID))
            shortConversationDivs.get(currentConversationID).classList.remove('short-conversation-selected');

        findListDiv.replaceChildren();
        findTextfield.value = '';

        currentConversationID = conversation._id;
        newChatDiv.classList.add('short-conversation-selected');
        messageArea.replaceChildren();

        let messages = conversations.get(conversation._id);
        messages.forEach(message => {
            appendMessage(message);
        });
    })
}


socket.on(('response-conversation'), (data) => {
    let messages = data.messages;
    let conversation = data.conversation;
    let users = data.users;
    users.forEach(user => {
        usersList.set(user._id, user);
    });
    conversationInfos.set(conversation._id, conversation);
    conversations.set(conversation._id, messages);
    initConversationsList(conversation._id);
})

function appendMessage(message) {
    let msgFullDiv = document.createElement('div');
    let mainDiv = document.createElement('div');
    mainDiv.classList.add('msg-rcv');
    msgFullDiv.appendChild(mainDiv);

    let msg;
    if (userInfo._id === message.sender) {
        msg = {
            sender: userInfo.username,
            content: message.content
        }
        msgFullDiv.classList.add('msg-send-full-line');
    } else {
        msg = {
            sender: usersList.get(message.sender).username,
            content: message.content
        }
        msgFullDiv.classList.add('msg-rcv-full-line');
    }

    let senderLabel = document.createElement('div');
    let contentText = document.createElement('div');
    senderLabel.textContent = msg.sender;
    senderLabel.classList.add('sender-label');
    contentText.textContent = msg.content;
    mainDiv.appendChild(senderLabel);
    mainDiv.appendChild(contentText);

    messageArea.appendChild(msgFullDiv);
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
                    usernameDiv.textContent = "Account: " + userInfo.username;
                    socket.emit('add-user', userInfo._id);
                    data.conversation.forEach(conversationID => {
                        if (!conversationIDList.includes(conversationID)) {
                            socket.emit('join-room', 'room-' + conversationID);
                            let req = {
                                conversationID: conversationID,
                                requester: userInfo._id
                            }
                            socket.emit('request-conversation', req);
                            socket.on('room-' + conversationID + 'message', (message) => {
                                conversations.get(conversationID).push(message);
                                conversationInfos.get(conversationID).lastUpdated = message.dateTime;
                                initShortConversation(conversationID);
                                if (conversationID == currentConversationID)
                                    appendMessage(message);
                            });
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
                            let conversation = data.conversation;
                            if (!conversationIDList.includes(conversation._id)) {
                                currentConversationID = conversation._id;
                                conversationInfos.set(conversation._id, conversation);
                                conversations.set(conversation._id, []);
                                initConversationsList(conversation._id);
                                socket.emit('join-room', 'room-' + conversation._id);
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