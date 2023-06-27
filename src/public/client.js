const socket = io()

let name;

let textarea = document.querySelector('#user-textfield')
let sendButton = document.querySelector('#send-button')
let messageArea = document.querySelector('.chat-container')

do {
    name = prompt('Please enter your name: ')
} while (!name)

textarea.addEventListener('keyup', (e) => {
    if (e.key === "Enter") {
        sendMessage(e.target.value);
    }
})

sendButton.addEventListener('click', (e)=>{
    sendMessage(textarea.value);
})
function sendMessage(text) {
    let msg = {
        user: name,
        message: text
    }
    appendMessage(msg, 'outgoing');
}

function appendMessage(msg, type) {
    let mainDiv = document.createElement('div');
    let className = type;
    mainDiv.classList.add(className, 'message');

    let markup = `
    <h4>${msg.user}</h4>
    <p>${msg.message}</p>
    `

    mainDiv.innerHTML = markup;

    messageArea.appendChild(mainDiv);
}