const socket = io()

let name;

let textarea = document.querySelector('#user-input')
console.log(textarea)
let messagArea = document.querySelector('.message_area')

do {
    name = prompt('Please enter your name: ')
} while (!name)

textarea.addEventListener('keyup', (e) => {
    if (e.key === "Enter") {
        sendMessage(e.target.value);
    }
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
    <h4>${msg.user}/</h4>
    <p>${msg.message}</p>
    `

    mainDiv.innerHTML = markup;

    messagArea.appendChild(mainDiv);
}